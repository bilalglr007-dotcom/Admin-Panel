import { useEffect, useState, useCallback } from 'react';
import { rolePrivilegesAPI, rolesAPI } from '../api/index.js';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Pencil, Trash2, Key, RefreshCw } from 'lucide-react';

const PERMISSIONS = ['READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE', 'VIEW_LOGS', 'ADMIN_ALL'];

const RolePrivilegesPage = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ role_id: '', permission: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });
  const closeToast = () => setToast(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rpRes, rRes] = await Promise.all([rolePrivilegesAPI.getAll(), rolesAPI.getAll()]);
      setData(rpRes.data || []); setRoles(rRes.data || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getRoleName = (id) => { const r = roles.find(r => r._id === id); return r ? r.role_name : id; };

  const handleSave = async () => {
    if (!form.role_id || !form.permission) return showToast('Rol ve yetki zorunludur!', 'error');
    setSaving(true);
    try {
      if (modal === 'add') { await rolePrivilegesAPI.create(form); showToast('Yetki tanımlandı!'); }
      else { await rolePrivilegesAPI.update(selected._id, form); showToast('Yetki güncellendi!'); }
      setModal(null); load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await rolePrivilegesAPI.delete(selected._id); showToast('Yetki silindi!'); setModal(null); load(); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const PERM_COLORS = { READ: '#3b82f6', WRITE: '#10b981', UPDATE: '#f59e0b', DELETE: '#ef4444', MANAGE: '#8b5cf6', VIEW_LOGS: '#06b6d4', ADMIN_ALL: '#ec4899' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Rol-Yetki İlişkileri</h2>
          <p className="page-subtitle">Rollere yetki tanımlayın</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ role_id: '', permission: '' }); setModal('add'); }}>
          <Plus size={16} /> Yetki Tanımla
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={load} style={{ padding: '8px 12px', fontSize: '13px' }}><RefreshCw size={14} /> Yenile</button>
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
          : data.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}><Key size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>Yetki bulunamadı</p></div>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>#</th><th>Rol</th><th>Yetki</th><th>Tarih</th><th>İşlemler</th></tr></thead>
                <tbody>
                  {data.map((item, i) => {
                    const pColor = PERM_COLORS[item.permission] || '#6366f1';
                    return (
                      <tr key={item._id}>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{i + 1}</td>
                        <td><span className="badge badge-purple">{getRoleName(item.role_id)}</span></td>
                        <td>
                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', background: pColor + '20', color: pColor }}>
                            {item.permission}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-icon" onClick={() => { setSelected(item); setForm({ role_id: item.role_id, permission: item.permission }); setModal('edit'); }}><Pencil size={14} color="#6366f1" /></button>
                            <button className="btn-icon" onClick={() => { setSelected(item); setModal('delete'); }} style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Toplam {data.length} yetki tanımı
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Yetki Tanımla' : 'Yetkiyi Düzenle'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Rol *</label>
              <select className="input-field" value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
                <option value="">Rol Seçin</option>
                {roles.map(r => <option key={r._id} value={r._id}>{r.role_name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Yetki *</label>
              <select className="input-field" value={form.permission} onChange={e => setForm({ ...form, permission: e.target.value })}>
                <option value="">Yetki Seçin</option>
                {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={() => setModal(null)}>İptal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : (modal === 'add' ? 'Tanımla' : 'Kaydet')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Yetkiyi Sil" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Bu yetki tanımını silmek istediğinizden emin misiniz?</p>
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

export default RolePrivilegesPage;
