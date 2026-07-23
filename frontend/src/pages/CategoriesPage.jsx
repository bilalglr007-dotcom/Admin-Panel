import { useEffect, useState, useCallback } from 'react';
import { categoriesAPI } from '../api/index.js';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Pencil, Trash2, FolderOpen, RefreshCw, Search } from 'lucide-react';

const CategoriesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = () => setToast(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      setData(res.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name: '', is_active: true }); setModal('add'); };
  const openEdit = (item) => { setSelected(item); setForm({ name: item.name, is_active: item.is_active }); setModal('edit'); };
  const openDelete = (item) => { setSelected(item); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast('Kategori adı zorunludur!', 'error');
    setSaving(true);
    try {
      if (modal === 'add') {
        await categoriesAPI.create(form);
        showToast('Kategori başarıyla eklendi!');
      } else {
        await categoriesAPI.update(selected._id, form);
        showToast('Kategori güncellendi!');
      }
      closeModal();
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await categoriesAPI.delete(selected._id);
      showToast('Kategori silindi!');
      closeModal();
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = data.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="page-header">
        <div>
          <h2 className="page-title">Kategori Yönetimi</h2>
          <p className="page-subtitle">Sistemdeki kategorileri yönetin</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Yeni Kategori
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', flex: 1, maxWidth: '300px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input placeholder="Kategori ara..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }} />
          </div>
          <button className="btn-secondary" onClick={load} style={{ padding: '8px 12px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Yenile
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FolderOpen size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>Kategori bulunamadı</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kategori Adı</th>
                  <th>Durum</th>
                  <th>Oluşturulma</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FolderOpen size={15} color="#6366f1" />
                        </div>
                        <span style={{ fontWeight: '600' }}>{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.is_active ? 'badge-success' : 'badge-error'}`}>
                        {item.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon" onClick={() => openEdit(item)} title="Düzenle">
                          <Pencil size={14} color="#6366f1" />
                        </button>
                        <button className="btn-icon" onClick={() => openDelete(item)} title="Sil" style={{ color: 'var(--error)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Toplam {data.length} kategori</span>
          <span>Gösterilen: {filtered.length}</span>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Kategori Adı *</label>
              <input className="input-field" placeholder="Kategori adını girin" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Durum</label>
              <button
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                style={{
                  width: '48px', height: '26px', borderRadius: '13px',
                  background: form.is_active ? '#6366f1' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '3px', left: form.is_active ? '25px' : '3px',
                  transition: 'left 0.2s',
                }} />
              </button>
              <span style={{ fontSize: '13px', color: form.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
                {form.is_active ? 'Aktif' : 'Pasif'}
              </span>
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
        <Modal title="Kategoriyi Sil" onClose={closeModal}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{selected?.name}</strong> kategorisini silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
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

export default CategoriesPage;
