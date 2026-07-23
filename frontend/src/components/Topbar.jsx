import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Search, Menu, Sun, Moon, User, LogOut, CheckCheck, ExternalLink,
  Shield, FolderOpen, Users, ClipboardList, Key, X, Lock, Phone, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auditLogsAPI, categoriesAPI, usersAPI, rolesAPI, profileAPI } from '../api/index.js';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
];

const PAGES_LIST = [
  { name: 'Dashboard', path: '/dashboard', icon: Shield },
  { name: 'Kategoriler', path: '/dashboard/categories', icon: FolderOpen },
  { name: 'Kullanıcılar', path: '/dashboard/users', icon: Users },
  { name: 'Roller', path: '/dashboard/roles', icon: Shield },
  { name: 'Kullanıcı-Rol Atamaları', path: '/dashboard/user-roles', icon: Users },
  { name: 'Rol-Yetki Atamaları', path: '/dashboard/role-privileges', icon: Key },
  { name: 'Audit Logs', path: '/dashboard/audit-logs', icon: ClipboardList },
];

const Topbar = ({ collapsed, setCollapsed, title }) => {
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Arama Durumu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bildirim Durumu
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Profil Menüsü & Modal Durumu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profil Formu State
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    avatar: '',
    banner: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Son Audit Loglarını Bildirimler İçin Çekme
  const fetchNotifications = async () => {
    try {
      const res = await auditLogsAPI.getAll();
      const logs = res.data || [];
      const recent = logs.slice(0, 8);
      setNotifications(recent);
      
      const lastReadTime = localStorage.getItem('notif_read_time') || 0;
      const unread = recent.filter(l => new Date(l.createdAt).getTime() > Number(lastReadTime)).length;
      setUnreadCount(unread > 0 ? unread : 0);
    } catch {
      // Hata durumunda sessiz kal
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    localStorage.setItem('notif_read_time', Date.now().toString());
    setUnreadCount(0);
  };

  // Dışarıya tıklanınca açılır popover'ları kapatma
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setIsProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Canlı Arama İşlevi
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches = [];

    PAGES_LIST.forEach(page => {
      if (page.name.toLowerCase().includes(q)) {
        matches.push({ type: 'page', title: page.name, sub: 'Sayfa Navigasyonu', path: page.path, icon: page.icon });
      }
    });

    Promise.allSettled([
      categoriesAPI.getAll(),
      usersAPI.getAll(),
      rolesAPI.getAll(),
    ]).then(([catsRes, usersRes, rolesRes]) => {
      if (catsRes.status === 'fulfilled') {
        (catsRes.value.data || []).forEach(c => {
          if (c.name?.toLowerCase().includes(q)) {
            matches.push({ type: 'category', title: c.name, sub: `Kategori (${c.is_active ? 'Aktif' : 'Pasif'})`, path: '/dashboard/categories', icon: FolderOpen });
          }
        });
      }
      if (usersRes.status === 'fulfilled') {
        (usersRes.value.data || []).forEach(u => {
          const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
          if (fullName.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) {
            matches.push({ type: 'user', title: fullName || u.email, sub: u.email, path: '/dashboard/users', icon: Users });
          }
        });
      }
      if (rolesRes.status === 'fulfilled') {
        (rolesRes.value.data || []).forEach(r => {
          if (r.name?.toLowerCase().includes(q)) {
            matches.push({ type: 'role', title: r.name, sub: 'Rol Yetkisi', path: '/dashboard/roles', icon: Shield });
          }
        });
      }
      setSearchResults(matches);
      setIsSearchOpen(true);
    });
  }, [searchQuery]);

  // Profil Modalı Açılırken Mevcut Kullanıcı Bilgilerini Yükleme
  const openProfileModal = () => {
    setProfileForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      avatar: user?.avatar || '',
      banner: user?.banner || '',
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setProfileMessage(null);
    setIsProfileModalOpen(true);
    setIsProfileMenuOpen(false);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMessage(null);

    if (profileForm.new_password) {
      if (profileForm.new_password !== profileForm.confirm_password) {
        setProfileMessage({ type: 'error', text: 'Yeni şifreler birbiriyle eşleşmiyor!' });
        return;
      }
      if (profileForm.new_password.length < 6) {
        setProfileMessage({ type: 'error', text: 'Yeni şifreniz en az 6 karakter olmalıdır!' });
        return;
      }
    }

    setSavingProfile(true);
    try {
      const payload = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone_number: profileForm.phone_number,
        avatar: profileForm.avatar,
        banner: profileForm.banner,
      };

      if (profileForm.new_password) {
        payload.current_password = profileForm.current_password;
        payload.new_password = profileForm.new_password;
      }

      const res = await profileAPI.updateMe(payload);
      updateUserData(res.data);
      setProfileMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi! 🎉' });
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setProfileMessage(null);
      }, 1500);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Profil güncellenemedi.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff} sn önce`;
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  return (
    <>
      <header style={{
        height: '64px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}>
        {/* Sol Başlık & Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-icon"
          >
            <Menu size={18} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* ─── 1. Canlı Arama Çubuğu ─── */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 14px',
              width: '240px',
              transition: 'all 0.2s ease',
            }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                placeholder="Ara (Modül, Kullanıcı, Log)..."
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '13px', width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Arama Sonuçları Popup */}
            {isSearchOpen && (
              <div className="card" style={{
                position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100,
                width: '320px', maxHeight: '360px', overflowY: 'auto', padding: '8px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.3)', background: 'var(--bg-card)',
                border: '1px solid var(--border)', animation: 'fadeIn 0.2s ease',
              }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Aramanızla eşleşen bir sonuç bulunamadı.
                  </div>
                ) : (
                  searchResults.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          navigate(item.path);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: 'rgba(99,102,241,0.12)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <ItemIcon size={16} color="var(--accent-primary)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.sub}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* ─── 2. Koyu / Açık Tema Değiştirme ─── */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            style={{ transition: 'transform 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {theme === 'dark' ? (
              <Sun size={18} color="#fbbf24" />
            ) : (
              <Moon size={18} color="#6366f1" />
            )}
          </button>

          {/* ─── 3. Gerçek Log Destekli Bildirim Kutusu ─── */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) markAllAsRead();
              }}
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Bildirimler"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#ef4444', color: 'white',
                  borderRadius: '10px', padding: '1px 5px',
                  fontSize: '10px', fontWeight: '800', border: '2px solid var(--bg-secondary)',
                  lineHeight: '1', minWidth: '16px', textAlign: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Bildirim Dropdown Popover */}
            {isNotifOpen && (
              <div className="card" style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 100,
                width: '340px', maxHeight: '420px', display: 'flex', flexDirection: 'column',
                boxShadow: '0 12px 36px rgba(0,0,0,0.3)', background: 'var(--bg-card)',
                border: '1px solid var(--border)', animation: 'fadeIn 0.2s ease', overflow: 'hidden'
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Son Aktivite & Loglar</span>
                  </div>
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                  >
                    <CheckCheck size={13} /> Okundu
                  </button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: '6px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Henüz bildirim kaydı yok.
                    </div>
                  ) : (
                    notifications.map(log => (
                      <div
                        key={log._id}
                        style={{
                          padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
                          display: 'flex', gap: '10px', alignItems: 'flex-start',
                          transition: 'background 0.15s ease', cursor: 'default'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
                          background: log.proc_type === 'DELETE' ? '#ef4444' : log.proc_type === 'POST' ? '#10b981' : log.proc_type === 'LOGIN' ? '#f59e0b' : '#6366f1'
                        }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                            {log.log}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{log.email}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{getTimeAgo(log.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ padding: '10px', borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-secondary)' }}>
                  <button
                    onClick={() => { navigate('/dashboard/audit-logs'); setIsNotifOpen(false); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px',
                      color: 'var(--accent-primary)', fontWeight: '600', display: 'inline-flex',
                      alignItems: 'center', gap: '6px'
                    }}
                  >
                    Tüm Audit Loglarını Gör <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── 4. Kullanıcı Profil Menüsü & Fotoğrafı ─── */}
          <div style={{ position: 'relative' }} ref={profileMenuRef}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: '700', color: 'white',
                cursor: 'pointer', overflow: 'hidden',
                border: '2px solid var(--border)', transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              title="Profil ve Ayarlar"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.first_name?.[0]?.toUpperCase() || 'U'
              )}
            </div>

            {/* Profil Dropdown Popover */}
            {isProfileMenuOpen && (
              <div className="card" style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 100,
                width: '240px', padding: '8px', boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                animation: 'fadeIn 0.2s ease',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={openProfileModal}
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--text-primary)',
                    background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <User size={15} color="var(--accent-primary)" /> Profilimi Düzenle
                </button>

                <button
                  onClick={logout}
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: '13px', color: 'var(--error)',
                    background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                    borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={15} /> Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 5. Profil Düzenleme Modalı (Banner, Avatar, Şifre, Telefon vb.) ─── */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Banner Görseli Header */}
            <div style={{
              height: '130px', position: 'relative',
              background: profileForm.banner ? `url(${profileForm.banner}) center/cover no-repeat` : 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
            }}>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                  borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>

              {/* Avatar Önizleme */}
              <div style={{
                position: 'absolute', bottom: '-35px', left: '24px',
                width: '76px', height: '76px', borderRadius: '50%',
                border: '4px solid var(--bg-card)', background: 'var(--bg-secondary)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
              }}>
                {profileForm.avatar ? (
                  <img src={profileForm.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-primary)' }}>
                    {profileForm.first_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Form İçeriği */}
            <form onSubmit={handleProfileSave} style={{ padding: '44px 24px 24px 24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Profil Ayarları
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Profil resminizi, kapak görselinizi, kişisel bilgilerinizi ve şifrenizi aşağıdan güncelleyebilirsiniz.
              </p>

              {profileMessage && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px',
                  background: profileMessage.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${profileMessage.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                  color: profileMessage.type === 'success' ? 'var(--success)' : 'var(--error)'
                }}>
                  {profileMessage.text}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Ad</label>
                  <input
                    className="input-field"
                    value={profileForm.first_name}
                    onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Soyad</label>
                  <input
                    className="input-field"
                    value={profileForm.last_name}
                    onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Telefon Numarası</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input-field"
                      placeholder="0555 123 45 67"
                      value={profileForm.phone_number}
                      onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>E-Posta (Değiştirilemez)</label>
                  <input
                    className="input-field"
                    value={user?.email || ''}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Avatar & Banner Görsel URL'leri ve Hazır Seçimler */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="var(--accent-primary)" /> Profil Resmi URL (Avatar)
                </label>
                <input
                  className="input-field"
                  placeholder="https://örnek.com/resim.jpg"
                  value={profileForm.avatar}
                  onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hazır Resimler:</span>
                  {PRESET_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preset"
                      onClick={() => setProfileForm({ ...profileForm, avatar: url })}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer',
                        border: profileForm.avatar === url ? '2px solid var(--accent-primary)' : '1px solid var(--border)'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="#f59e0b" /> Banner / Kapak Resmi URL
                </label>
                <input
                  className="input-field"
                  placeholder="https://örnek.com/banner.jpg"
                  value={profileForm.banner}
                  onChange={e => setProfileForm({ ...profileForm, banner: e.target.value })}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hazır Kapaklar:</span>
                  {PRESET_BANNERS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Banner Preset"
                      onClick={() => setProfileForm({ ...profileForm, banner: url })}
                      style={{
                        width: '40px', height: '22px', borderRadius: '4px', cursor: 'pointer', objectFit: 'cover',
                        border: profileForm.banner === url ? '2px solid var(--accent-primary)' : '1px solid var(--border)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Şifre Değiştirme Alanı */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} color="#ec4899" /> Şifre Değiştir (İsteğe Bağlı)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Mevcut Şifre"
                      value={profileForm.current_password}
                      onChange={e => setProfileForm({ ...profileForm, current_password: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Yeni Şifre"
                      value={profileForm.new_password}
                      onChange={e => setProfileForm({ ...profileForm, new_password: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Yeni Şifre Tekrar"
                      value={profileForm.confirm_password}
                      onChange={e => setProfileForm({ ...profileForm, confirm_password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
