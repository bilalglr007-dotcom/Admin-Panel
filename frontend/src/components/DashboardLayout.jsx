import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/categories': 'Kategori Yönetimi',
  '/dashboard/users': 'Kullanıcı Yönetimi',
  '/dashboard/roles': 'Rol Yönetimi',
  '/dashboard/user-roles': 'Kullanıcı-Rol İlişkileri',
  '/dashboard/role-privileges': 'Rol-Yetki İlişkileri',
  '/dashboard/audit-logs': 'Audit Logs',
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{
        flex: 1,
        marginLeft: collapsed ? '72px' : '260px',
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} title={title} />
        <main style={{ flex: 1, padding: '28px', animation: 'fadeIn 0.3s ease' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
