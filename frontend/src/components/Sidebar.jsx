import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FolderOpen, Users, Shield, Link2,
  Key, ClipboardList, LogOut, ChevronLeft, ChevronRight,
  Menu
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const NAV_SECTIONS = [
  {
    label: 'ANA MENÜ',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'YÖNETİM',
    items: [
      { to: '/dashboard/categories', icon: FolderOpen, label: 'Kategoriler' },
      { to: '/dashboard/users', icon: Users, label: 'Kullanıcılar' },
      { to: '/dashboard/roles', icon: Shield, label: 'Roller' },
    ],
  },
  {
    label: 'YETKİLENDİRME',
    items: [
      { to: '/dashboard/user-roles', icon: Link2, label: 'Kullanıcı-Rol' },
      { to: '/dashboard/role-privileges', icon: Key, label: 'Rol-Yetki' },
    ],
  },
  {
    label: 'LOGLAR',
    items: [
      { to: '/dashboard/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
    ],
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={logoImg}
              alt="AdminPro Logo"
              style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Admin<span className="gradient-text">Pro</span>
            </span>
          </div>
        )}
        {collapsed && (
          <img
            src={logoImg}
            alt="AdminPro Logo"
            style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
          />
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="btn-icon"
            style={{ padding: '4px' }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {!collapsed && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '700', color: 'white', flexShrink: 0,
            overflow: 'hidden', border: '1px solid var(--border)',
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.first_name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name || ''}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: '8px' }}>
            {!collapsed && (
              <p style={{
                fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)',
                letterSpacing: '1px', padding: '8px 8px 4px',
              }}>
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={collapsed ? { justifyContent: 'center', padding: '12px 0' } : {}}
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {collapsed && (
        <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCollapsed(false)}
            className="btn-icon"
            title="Menüyü Genişlet"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="btn-icon"
            title="Çıkış Yap"
            style={{ color: 'var(--error)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      {!collapsed && (
        <div style={{ padding: '16px 10px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ width: '100%', border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}
          >
            <LogOut size={18} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
