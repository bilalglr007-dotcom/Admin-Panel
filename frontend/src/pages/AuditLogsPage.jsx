import { useEffect, useState, useCallback } from 'react';
import { auditLogsAPI } from '../api/index.js';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { ClipboardList, RefreshCw, Search, Trash2, Calendar, X } from 'lucide-react';

const LEVEL_BADGE = {
  INFO:   { cls: 'badge-info', label: 'INFO' },
  WARN:   { cls: 'badge-warning', label: 'WARN' },
  ERROR:  { cls: 'badge-error', label: 'ERROR' },
  DEBUG:  { cls: 'badge-purple', label: 'DEBUG' },
};

const PROC_COLORS = {
  POST: '#10b981', PUT: '#f59e0b', DELETE: '#ef4444',
  GET: '#3b82f6', LOGIN: '#6366f1', REGISTER: '#8b5cf6',
};

const AuditLogsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterProc, setFilterProc] = useState('');

  // Tarih Filtreleri State'leri
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRangePreset, setDateRangePreset] = useState('all');

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });
  const closeToast = () => setToast(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditLogsAPI.getAll();
      const logs = res.data || [];
      // En yeni loglar en başta listelenecek şekilde sıralama
      logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setData(logs);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setSaving(true);
    try {
      await auditLogsAPI.delete(selected._id);
      showToast('Log silindi!');
      setModal(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Hazır Tarih Filtresi Seçimi (Bugün, Son 7 Gün vb.)
  const handlePresetChange = (preset) => {
    setDateRangePreset(preset);
    const now = new Date();

    if (preset === 'today') {
      const todayStr = now.toISOString().slice(0, 10);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().slice(0, 10);
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === 'last7') {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      setStartDate(d.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === 'last30') {
      const d = new Date(now);
      d.setDate(d.getDate() - 29);
      setStartDate(d.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(startOfMonth.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setFilterLocation('');
    setFilterProc('');
    setStartDate('');
    setEndDate('');
    setDateRangePreset('all');
  };

  const locations = [...new Set(data.map(d => d.location).filter(Boolean))];
  const procs = [...new Set(data.map(d => d.proc_type).filter(Boolean))];

  // Filtreleme Mantığı (Metin, Modül, İşlem & Tarih Aralığı)
  const filtered = data.filter(d => {
    const matchSearch = !search || `${d.email} ${d.log} ${d.location}`.toLowerCase().includes(search.toLowerCase());
    const matchLoc = !filterLocation || d.location === filterLocation;
    const matchProc = !filterProc || d.proc_type === filterProc;

    let matchDate = true;
    if (d.createdAt) {
      const logTime = new Date(d.createdAt).getTime();
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        if (logTime < start) matchDate = false;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        if (logTime > end) matchDate = false;
      }
    }

    return matchSearch && matchLoc && matchProc && matchDate;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Audit Logs</h2>
          <p className="page-subtitle">Sistem işlem kayıtları (En yeni işlemler en başta)</p>
        </div>
        <button className="btn-secondary" onClick={load} style={{ padding: '10px 16px', fontSize: '13px' }}>
          <RefreshCw size={14} /> Yenile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Toplam Log', value: data.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'POST İşlemleri', value: data.filter(d => d.proc_type === 'POST').length, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'DELETE İşlemleri', value: data.filter(d => d.proc_type === 'DELETE').length, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Giriş İşlemleri', value: data.filter(d => d.proc_type === 'LOGIN').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Üst Filtreleme Barı */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Metin Arama */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', flex: 1, minWidth: '180px', maxWidth: '260px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              placeholder="Log, e-posta ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }}
            />
          </div>

          {/* Modül Seçimi */}
          <select
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Tüm Modüller</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          {/* İşlem Türü Seçimi */}
          <select
            value={filterProc}
            onChange={e => setFilterProc(e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Tüm İşlemler</option>
            {procs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Hazır Tarih Aralığı Seçici */}
          <select
            value={dateRangePreset}
            onChange={e => handlePresetChange(e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="yesterday">Dün</option>
            <option value="last7">Son 7 Gün</option>
            <option value="last30">Son 30 Gün</option>
            <option value="thisMonth">Bu Ay</option>
          </select>

          {/* Özel Tarih Seçiciler (Başlangıç ve Bitiş) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px' }}>
            <Calendar size={14} color="var(--accent-primary)" />
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setDateRangePreset('custom'); }}
              title="Başlangıç Tarihi"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>-</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setDateRangePreset('custom'); }}
              title="Bitiş Tarihi"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}
            />
          </div>

          {(filterLocation || filterProc || search || startDate || endDate) && (
            <button
              className="btn-secondary"
              onClick={clearAllFilters}
              style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> Temizle
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ClipboardList size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>Seçilen kriterlere uygun log kaydı bulunamadı.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seviye</th>
                  <th>E-Posta</th>
                  <th>Modül</th>
                  <th>İşlem</th>
                  <th>Log Mesajı</th>
                  <th>Tarih</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const lvl = LEVEL_BADGE[item.level] || { cls: 'badge-info', label: item.level };
                  const pColor = PROC_COLORS[item.proc_type] || '#6366f1';
                  return (
                    <tr key={item._id}>
                      <td><span className={`badge ${lvl.cls}`}>{lvl.label}</span></td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.email}</td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc' }}>
                          {item.location}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', background: pColor + '20', color: pColor }}>
                          {item.proc_type}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '360px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.log}>
                        {item.log}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('tr-TR') : '—'}
                      </td>
                      <td>
                        <button className="btn-icon" onClick={() => { setSelected(item); setModal('delete'); }} style={{ color: 'var(--error)' }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Toplam {data.length} kayıt</span>
          <span>Gösterilen: {filtered.length}</span>
        </div>
      </div>

      {modal === 'delete' && (
        <Modal title="Logu Sil" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
            Bu log kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setModal(null)}>İptal</button>
            <button className="btn-danger" onClick={handleDelete} disabled={saving} style={{ padding: '10px 20px', opacity: saving ? 0.7 : 1 }}>
              {saving ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><Trash2 size={14} /> Sil</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuditLogsPage;
