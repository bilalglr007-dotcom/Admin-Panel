import { useEffect, useState, useCallback } from 'react';
import { auditLogsAPI } from '../api/index.js';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import {
  ClipboardList,
  RefreshCw,
  Search,
  Trash2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, post: 0, delete: 0, login: 0 });

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

  const load = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const res = await auditLogsAPI.getAll({
        page: targetPage,
        limit: 10,
        search,
        location: filterLocation,
        proc_type: filterProc,
        startDate,
        endDate
      });

      setData(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterLocation, filterProc, startDate, endDate]);

  useEffect(() => {
    load(page);
  }, [page, load]);

  // Filtreler değiştiğinde sayfayı 1 yapıp yeniden yükle
  const handleFilterChange = (setter, val) => {
    setter(val);
    setPage(1);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await auditLogsAPI.delete(selected._id);
      showToast('Log silindi!');
      setModal(null);
      load(page);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Hazır Tarih Filtresi Seçimi (Bugün, Son 7 Gün vb.)
  const handlePresetChange = (preset) => {
    setDateRangePreset(preset);
    setPage(1);
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
    setPage(1);
  };

  const locations = ['AUTH', 'USERS', 'ROLES', 'USER_ROLES', 'ROLE_PRIVILEGES', 'CATEGORIES'];
  const procs = ['POST', 'PUT', 'DELETE', 'LOGIN', 'REGISTER', 'GET'];

  const startItem = pagination.totalCount > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  // Sayfalama buton aralığı hesabı
  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const current = page;
    const pages = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (current <= 3) {
      end = Math.min(total, 5);
    }
    if (current >= total - 2) {
      start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Audit Logs</h2>
          <p className="page-subtitle">Sistem işlem kayıtları (Sayfa 1'de en yeni işlemler tutulur)</p>
        </div>
        <button className="btn-secondary" onClick={() => load(page)} style={{ padding: '10px 16px', fontSize: '13px' }}>
          <RefreshCw size={14} /> Yenile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Toplam Log', value: stats.total || pagination.totalCount, color: '#6366f1' },
          { label: 'POST İşlemleri', value: stats.post || 0, color: '#10b981' },
          { label: 'DELETE İşlemleri', value: stats.delete || 0, color: '#ef4444' },
          { label: 'Giriş İşlemleri', value: stats.login || 0, color: '#f59e0b' },
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
              onChange={e => handleFilterChange(setSearch, e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }}
            />
          </div>

          {/* Modül Seçimi */}
          <select
            value={filterLocation}
            onChange={e => handleFilterChange(setFilterLocation, e.target.value)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Tüm Modüller</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          {/* İşlem Türü Seçimi */}
          <select
            value={filterProc}
            onChange={e => handleFilterChange(setFilterProc, e.target.value)}
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
              onChange={e => { handleFilterChange(setStartDate, e.target.value); setDateRangePreset('custom'); }}
              title="Başlangıç Tarihi"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>-</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { handleFilterChange(setEndDate, e.target.value); setDateRangePreset('custom'); }}
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
        ) : data.length === 0 ? (
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
                {data.map((item) => {
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

        {/* Sayfalama Barı */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <div>
            Toplam <strong style={{ color: 'var(--text-primary)' }}>{pagination.totalCount}</strong> kayıttan <strong style={{ color: 'var(--text-primary)' }}>{startItem}-{endItem}</strong> arası gösteriliyor
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn-icon"
              disabled={page <= 1}
              onClick={() => setPage(1)}
              title="İlk Sayfa"
              style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="btn-icon"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              title="Önceki Sayfa"
              style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map(pNum => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: pNum === page ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                  background: pNum === page ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: pNum === page ? '#fff' : 'var(--text-primary)',
                  fontWeight: pNum === page ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              className="btn-icon"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              title="Sonraki Sayfa"
              style={{ opacity: page >= pagination.totalPages ? 0.4 : 1, cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="btn-icon"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(pagination.totalPages)}
              title="Son Sayfa"
              style={{ opacity: page >= pagination.totalPages ? 0.4 : 1, cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
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
