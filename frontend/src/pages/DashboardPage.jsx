import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, rolesAPI, categoriesAPI, auditLogsAPI } from '../api/index.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from 'recharts';
import {
  Users, FolderOpen, Shield, ClipboardList, TrendingUp, TrendingDown,
  Activity, Award, MoreVertical, RefreshCw, ExternalLink, LineChart as LineIcon, BarChart2, Filter
} from 'lucide-react';

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DAYS_TR   = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4'];

function buildMonthlyBuckets(n = 9) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      label: MONTHS_TR[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
      yazma: 0,
      auth: 0,
      toplam: 0,
    };
  });
}

function buildWeeklyBuckets() {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return {
      label: DAYS_TR[d.getDay()],
      dateStr: d.toISOString().slice(0, 10),
      yazma: 0,
      auth: 0,
      toplam: 0,
    };
  });
}

function buildChartData(logs, mode) {
  const WRITE_PROCS = ['POST', 'PUT', 'DELETE', 'UPDATE'];
  const AUTH_PROCS  = ['LOGIN', 'REGISTER'];

  if (mode === 'monthly') {
    const buckets = buildMonthlyBuckets(9);
    logs.forEach(log => {
      const d = new Date(log.createdAt);
      const bucket = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
      if (!bucket) return;
      bucket.toplam++;
      if (WRITE_PROCS.includes(log.proc_type)) bucket.yazma++;
      if (AUTH_PROCS.includes(log.proc_type))  bucket.auth++;
    });
    return buckets.map(b => ({ label: b.label, yazma: b.yazma, auth: b.auth, toplam: b.toplam }));
  } else {
    const buckets = buildWeeklyBuckets();
    logs.forEach(log => {
      const dateStr = new Date(log.createdAt).toISOString().slice(0, 10);
      const bucket = buckets.find(b => b.dateStr === dateStr);
      if (!bucket) return;
      bucket.toplam++;
      if (WRITE_PROCS.includes(log.proc_type)) bucket.yazma++;
      if (AUTH_PROCS.includes(log.proc_type))  bucket.auth++;
    });
    return buckets.map(b => ({ label: b.label, yazma: b.yazma, auth: b.auth, toplam: b.toplam }));
  }
}

const StatCard = ({ icon: Icon, label, value, change, changeType, color, bg }) => (
  <div className="card" style={{
    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease', cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ width: '48px', height: '48px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600',
        color: changeType === 'up' ? 'var(--success)' : 'var(--error)',
        background: changeType === 'up' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        padding: '3px 10px', borderRadius: '20px',
      }}>
        {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
    <div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{value}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '12px 16px',
      minWidth: '120px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: '13px', fontWeight: '600' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]           = useState({ users: 0, roles: 0, categories: 0, logs: 0 });
  const [allLogs, setAllLogs]       = useState([]);
  const [logsByType, setLogsByType] = useState([]);
  const [chartMode, setChartMode]   = useState('monthly');
  const [loading, setLoading]       = useState(true);

  const [openMenu, setOpenMenu] = useState(null);
  const [trendChartType, setTrendChartType] = useState('bar');
  const [pieFilter, setPieFilter] = useState('all');

  const menuRefBar = useRef(null);
  const menuRefPie = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRefBar.current && !menuRefBar.current.contains(e.target) &&
        menuRefPie.current && !menuRefPie.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chartData = buildChartData(allLogs, chartMode);

  const filteredLogsByType = pieFilter === 'write_only'
    ? logsByType.filter(l => ['POST', 'PUT', 'DELETE', 'UPDATE'].includes(l.name))
    : logsByType;

  const now = new Date();
  const thisMonthLogs = allLogs.filter(l => {
    const d = new Date(l.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const thisYearLogs = allLogs.filter(l => {
    return new Date(l.createdAt).getFullYear() === now.getFullYear();
  }).length;

  const lastMonthLogs = allLogs.filter(l => {
    const d = new Date(l.createdAt);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth();
  }).length;
  const monthlyPct = lastMonthLogs > 0
    ? Math.round(((thisMonthLogs - lastMonthLogs) / lastMonthLogs) * 100)
    : thisMonthLogs > 0 ? 100 : 0;

  const load = useCallback(async (retryCount = 0) => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, catsRes, logsRes] = await Promise.allSettled([
        usersAPI.getAll(),
        rolesAPI.getAll(),
        categoriesAPI.getAll(),
        auditLogsAPI.getAll(),
      ]);

      const isAnyRejected = [usersRes, rolesRes, catsRes, logsRes].some(r => r.status === 'rejected');
      if (isAnyRejected && retryCount < 2) {
        setTimeout(() => load(retryCount + 1), 300);
        return;
      }

      const users = usersRes.status === 'fulfilled' ? usersRes.value.data?.length || 0 : 0;
      const roles = rolesRes.status === 'fulfilled' ? rolesRes.value.data?.length || 0 : 0;
      const cats  = catsRes.status === 'fulfilled'  ? catsRes.value.data?.length  || 0 : 0;
      const logs  = logsRes.status === 'fulfilled'  ? logsRes.value.data || []        : [];

      setStats({ users, roles, categories: cats, logs: logs.length });
      setAllLogs(logs);

      const grouped = logs.reduce((acc, l) => {
        acc[l.proc_type] = (acc[l.proc_type] || 0) + 1;
        return acc;
      }, {});
      setLogsByType(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    } catch (err) {
      console.error('Dashboard yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const STAT_CARDS = [
    { icon: Users,        label: 'Toplam Kullanıcı', value: stats.users,      change: `${stats.users > 0 ? '+' : ''}${stats.users}`, changeType: 'up', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { icon: FolderOpen,   label: 'Toplam Kategori',  value: stats.categories, change: `${stats.categories > 0 ? '+' : ''}${stats.categories}`, changeType: 'up', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { icon: Shield,       label: 'Toplam Rol',        value: stats.roles,      change: `${stats.roles > 0 ? '+' : ''}${stats.roles}`, changeType: 'up', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: ClipboardList,label: 'Audit Log Sayısı',  value: stats.logs,       change: `+${thisMonthLogs} bu ay`, changeType: 'up', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  ];

  const monthlyPct2 = stats.logs > 0 ? Math.min(100, Math.round((thisMonthLogs / stats.logs) * 100)) : 0;
  const yearlyPct   = stats.logs > 0 ? Math.min(100, Math.round((thisYearLogs  / stats.logs) * 100)) : 0;
  const r = 32, circ = 2 * Math.PI * r;

  const chartSubtitle = chartMode === 'monthly'
    ? `Son 9 aylık veri (${allLogs.length} toplam log)`
    : `Son 7 günlük veri`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px',
        padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={20} color="#fbbf24" />
            <span style={{ fontSize: '13px', color: '#a5b4fc' }}>Admin Dashboard</span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: 'white' }}>
            Merhaba, {user?.first_name}! 👋
          </h2>
          <p style={{ fontSize: '14px', color: '#a5b4fc' }}>
            Sisteminizin genel durumunu aşağıdan takip edebilirsiniz.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '36px', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>
            {stats.logs.toLocaleString('tr-TR')}
          </p>
          <p style={{ fontSize: '13px', color: '#a5b4fc' }}>Toplam İşlem Kaydı</p>
          <p style={{ fontSize: '12px', color: '#818cf8', marginTop: '4px' }}>
            Bu ay: {thisMonthLogs} kayıt
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {STAT_CARDS.map(card => <StatCard key={card.label} {...card} />)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        <div className="card" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>İşlem & Auth Trendi</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {chartMode === 'monthly' ? 'Aylık sistem aktivitesi' : 'Günlük sistem aktivitesi'}
              </p>
            </div>
            
            <div style={{ position: 'relative' }} ref={menuRefBar}>
              <button
                className="btn-icon"
                onClick={() => setOpenMenu(openMenu === 'bar' ? null : 'bar')}
                style={{ background: openMenu === 'bar' ? 'var(--bg-card-hover)' : 'transparent' }}
              >
                <MoreVertical size={16} />
              </button>

              {openMenu === 'bar' && (
                <div className="card" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 50,
                  width: '210px', padding: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <button
                    onClick={() => { load(); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <RefreshCw size={14} color="#6366f1" /> Verileri Yenile
                  </button>

                  <button
                    onClick={() => { setTrendChartType(trendChartType === 'bar' ? 'line' : 'bar'); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {trendChartType === 'bar' ? <LineIcon size={14} color="#f59e0b" /> : <BarChart2 size={14} color="#6366f1" />}
                    {trendChartType === 'bar' ? 'Çizgi Grafiğine Geç' : 'Sütun Grafiğine Geç'}
                  </button>

                  <button
                    onClick={() => { navigate('/dashboard/audit-logs'); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                      borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '8px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <ExternalLink size={14} color="#10b981" /> Audit Loglarına Git
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>
          ) : chartData.every(d => d.yazma === 0 && d.auth === 0) ? (
            <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
              <Activity size={36} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: '13px' }}>Bu dönemde veri yok</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              {trendChartType === 'bar' ? (
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)', rx: 6 }} />
                  <Bar dataKey="yazma" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} name="Yazma" />
                  <Bar dataKey="auth"  fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} name="Auth" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line type="monotone" dataKey="yazma" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} name="Yazma" />
                  <Line type="monotone" dataKey="auth"  stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} name="Auth" />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {[{ color: '#6366f1', label: 'Yazma (POST/PUT/DELETE)' }, { color: '#f59e0b', label: 'Auth (Giriş/Kayıt)' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>İşlem Tipleri</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Audit log dağılımı</p>
            </div>
            
            <div style={{ position: 'relative' }} ref={menuRefPie}>
              <button
                className="btn-icon"
                onClick={() => setOpenMenu(openMenu === 'pie' ? null : 'pie')}
                style={{ background: openMenu === 'pie' ? 'var(--bg-card-hover)' : 'transparent' }}
              >
                <MoreVertical size={16} />
              </button>

              {openMenu === 'pie' && (
                <div className="card" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 50,
                  width: '210px', padding: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <button
                    onClick={() => { load(); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <RefreshCw size={14} color="#6366f1" /> Verileri Yenile
                  </button>

                  <button
                    onClick={() => { setPieFilter(pieFilter === 'all' ? 'write_only' : 'all'); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Filter size={14} color="#ec4899" />
                    {pieFilter === 'all' ? 'Sadece Yazma İşlemleri' : 'Tüm İşlemleri Göster'}
                  </button>

                  <button
                    onClick={() => { navigate('/dashboard/audit-logs'); setOpenMenu(null); }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)',
                      background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
                      borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '8px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <ExternalLink size={14} color="#10b981" /> Audit Loglarına Git
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>
          ) : filteredLogsByType.length === 0 ? (
            <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
              <Activity size={36} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: '13px' }}>Henüz log verisi yok</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={filteredLogsByType} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                  {filteredLogsByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Sistem Aktivitesi</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{chartSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            {[
              { key: 'monthly', label: 'Aylık' },
              { key: 'weekly',  label: 'Haftalık' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setChartMode(t.key)}
                style={{
                  padding: '6px 16px', fontSize: '12px', fontWeight: '600',
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: chartMode === t.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: chartMode === t.key ? 'white' : 'var(--text-muted)',
                  boxShadow: chartMode === t.key ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>
        ) : chartData.every(d => d.toplam === 0) ? (
          <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
            <Activity size={36} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '13px' }}>Bu dönemde veri yok</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradWriting" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAuth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="yazma"  stroke="#6366f1" strokeWidth={2} fill="url(#gradWriting)" name="Yazma" />
              <Area type="monotone" dataKey="auth"   stroke="#10b981" strokeWidth={2} fill="url(#gradAuth)"    name="Auth"  />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {[
          {
            label: 'Bu Ay İşlem',
            value: thisMonthLogs.toLocaleString('tr-TR'),
            sub: monthlyPct >= 0
              ? `+${monthlyPct}% geçen aya göre`
              : `${monthlyPct}% geçen aya göre`,
            subColor: monthlyPct >= 0 ? 'var(--success)' : 'var(--error)',
            color: '#6366f1',
            pct: monthlyPct2,
          },
          {
            label: 'Bu Yıl Toplam',
            value: thisYearLogs.toLocaleString('tr-TR'),
            sub: `Tüm logların %${yearlyPct}'i bu yıla ait`,
            subColor: 'var(--success)',
            color: '#f59e0b',
            pct: yearlyPct,
          },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle cx="40" cy="40" r={r} fill="none" stroke={item.color} strokeWidth="6"
                  strokeDasharray={`${circ * (item.pct / 100)} ${circ * (1 - item.pct / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: item.color }}>{item.pct}%</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '6px' }}>
                {loading ? '—' : item.value}
              </p>
              <p style={{ fontSize: '12px', color: item.subColor }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
