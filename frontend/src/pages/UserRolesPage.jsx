import { useEffect, useState, useCallback } from 'react';
import { userRolesAPI, usersAPI, rolesAPI } from '../api/index.js';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Trash2, Link2, RefreshCw } from 'lucide-react';

const UserRolesPage = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ user_id: '', role_id: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });
  const closeToast = () => setToast(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [urRes, uRes, rRes] = await Promise.all([
        userRolesAPI.getAll(),
        usersAPI.getAll(),
        rolesAPI.getAll(),
      ]);
      setData(urRes.data || []);
      setUsers(uRes.data || []);
      setRoles(rRes.data || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getUserName = (id) => {
    const u = users.find(u => u._id === id);
    return u ? `${u.first_name} ${u.last_name || ''} (${u.email})` : id;
  };
  const getRoleName = (id) => {
    const r = roles.find(r => r._id === id);
    return r ? r.role_name : id;
  };

  const handleSave = async () => {
    if (!form.user_id || !form.role_id) return showToast('Kullanıcı ve rol seçimi zorunludur!', 'error');
    setSaving(true);
    try {
      await userRolesAPI.create(form);
      showToast('Kullanıcı-Rol ilişkisi oluşturuldu!');
      setModal(null); setForm({ user_id: '', role_id: '' }); load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await userRolesAPI.delete(selected._id);
      showToast('İlişki silindi!'); setModal(null); load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Kullanıcı-Rol İlişkileri</h2>
          <p className="page-subtitle">Kullanıcılara rol atayın</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ user_id: '', role_id: '' }); setModal('add'); }}>
          <Plus size={16} /> Rol Ata
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={load} style={{ padding: '8px 12px', fontSize: '13px' }}><RefreshCw size={14} /> Yenile</button>
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
          : data.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}><Link2 size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>İlişki bulunamadı</p></div>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>#</th><th>Kullanıcı</th><th>Rol</th><th>Tarih</th><th>İşlem</th></tr></thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={item._id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{i + 1}</td>
                      <td style={{ fontSize: '14px' }}>{getUserName(item.user_id)}</td>
                      <td>
                        <span className="badge badge-purple">{getRoleName(item.role_id)}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '—'}</td>
                      <td>
                        <button className="btn-icon" onClick={() => { setSelected(item); setModal('delete'); }} style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Toplam {data.length} ilişki
        </div>
      </div>

      {modal === 'add' && (
        <Modal title="Kullanıcıya Rol Ata" onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Kullanıcı *</label>
              <select className="input-field" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })}>
                <option value="">Kullanıcı Seçin</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.first_name} {u.last_name} - {u.email}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Rol *</label>
              <select className="input-field" value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
                <option value="">Rol Seçin</option>
                {roles.map(r => <option key={r._id} value={r._id}>{r.role_name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={() => setModal(null)}>İptal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : 'Ata'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="İlişkiyi Sil" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Bu kullanıcı-rol ilişkisini silmek istediğinizden emin misiniz?</p>
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

export default UserRolesPage;
