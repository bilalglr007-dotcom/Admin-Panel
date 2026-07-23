import { useEffect, useState, useCallback } from 'react';
import { usersAPI } from '../api/index.js';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Pencil, Trash2, Users, RefreshCw, Search, Image as ImageIcon } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone_number: '', avatar: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = () => setToast(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll();
      setData(res.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ email: '', password: '', first_name: '', last_name: '', phone_number: '', avatar: '', is_active: true }); setModal('add'); };
  const openEdit = (item) => { setSelected(item); setForm({ email: item.email, first_name: item.first_name, last_name: item.last_name || '', phone_number: item.phone_number || '', avatar: item.avatar || '', is_active: item.is_active, password: '' }); setModal('edit'); };
  const openDelete = (item) => { setSelected(item); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    if (!form.first_name || !form.email) return showToast('Ad ve e-posta zorunludur!', 'error');
    if (modal === 'add' && !form.password) return showToast('Şifre zorunludur!', 'error');
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (modal === 'add') {
        await usersAPI.create(payload);
        showToast('Kullanıcı eklendi!');
      } else {
        await usersAPI.update(selected._id, payload);
        showToast('Kullanıcı güncellendi!');
      }
      closeModal(); load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await usersAPI.delete(selected._id);
      showToast('Kullanıcı silindi!');
      closeModal(); load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const filtered = data.filter(d =>
    `${d.first_name} ${d.last_name} ${d.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (u) => `${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase() || 'U';
  const COLORS = ['#6366f1','#10b981','#f59e0b','#ec4899','#3b82f6','#8b5cf6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Kullanıcı Yönetimi</h2>
          <p className="page-subtitle">Sistemdeki kullanıcıları yönetin</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Yeni Kullanıcı
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', flex: 1, maxWidth: '300px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input placeholder="Kullanıcı ara..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }} />
          </div>
          <button className="btn-secondary" onClick={load} style={{ padding: '8px 12px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Yenile
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>Kullanıcı bulunamadı</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Profil Fotoğrafı / Kullanıcı</th><th>E-Posta</th><th>Telefon</th><th>Durum</th><th>Kayıt Tarihi</th><th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Profil Fotoğrafı (Avatar) veya Harfli Çember */}
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: item.avatar ? 'none' : COLORS[i % COLORS.length] + '25',
                          border: '2px solid var(--border)', overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: '700', color: COLORS[i % COLORS.length],
                          flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          {item.avatar ? (
                            <img src={item.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            initials(item)
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{item.first_name} {item.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.phone_number || '—'}</td>
                    <td><span className={`badge ${item.is_active ? 'badge-success' : 'badge-error'}`}>{item.is_active ? 'Aktif' : 'Pasif'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon" onClick={() => openEdit(item)} title="Düzenle"><Pencil size={14} color="#6366f1" /></button>
                        <button className="btn-icon" onClick={() => openDelete(item)} title="Sil" style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Toplam {data.length} kullanıcı</span><span>Gösterilen: {filtered.length}</span>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'} onClose={closeModal} maxWidth="520px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Ad *</label>
                <input className="input-field" placeholder="Adı" value={form.first_name} onChange={set('first_name')} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Soyad</label>
                <input className="input-field" placeholder="Soyadı" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>E-Posta *</label>
              <input className="input-field" type="email" placeholder="ornek@email.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Telefon</label>
              <input className="input-field" placeholder="+90 5xx xxx xx xx" value={form.phone_number} onChange={set('phone_number')} />
            </div>

            {/* Profil Fotoğrafı (Avatar URL) & Önizlemeler */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={14} color="var(--accent-primary)" /> Profil Fotoğrafı (Avatar URL)
              </label>
              <input className="input-field" placeholder="https://ornek.com/foto.jpg" value={form.avatar} onChange={set('avatar')} style={{ marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hazır Resimler:</span>
                {PRESET_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Preset"
                    onClick={() => setForm({ ...form, avatar: url })}
                    style={{
                      width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer',
                      border: form.avatar === url ? '2px solid var(--accent-primary)' : '1px solid var(--border)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{modal === 'add' ? 'Şifre *' : 'Yeni Şifre (boş bırakılırsa değişmez)'}</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Durum</label>
              <button onClick={() => setForm({ ...form, is_active: !form.is_active })}
                style={{ width: '48px', height: '26px', borderRadius: '13px', background: form.is_active ? '#6366f1' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: form.is_active ? '25px' : '3px', transition: 'left 0.2s' }} />
              </button>
              <span style={{ fontSize: '13px', color: form.is_active ? 'var(--success)' : 'var(--text-muted)' }}>{form.is_active ? 'Aktif' : 'Pasif'}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={closeModal}>İptal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : (modal === 'add' ? 'Ekle' : 'Kaydet')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Kullanıcıyı Sil" onClose={closeModal}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{selected?.first_name} {selected?.last_name}</strong> kullanıcısını silmek istediğinizden emin misiniz?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={closeModal}>İptal</button>
            <button className="btn-danger" onClick={handleDelete} disabled={saving} style={{ padding: '10px 20px', opacity: saving ? 0.7 : 1 }}>
              {saving ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><Trash2 size={14} /> Sil</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
