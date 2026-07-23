import { Link } from 'react-router-dom';
import {
  Shield, ClipboardList, Users, ArrowRight,
  Zap, Building, CreditCard, Send
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const CLIENT_LOGOS = [
  { name: 'Node.js', icon: '🟢' },
  { name: 'Express', icon: '⚡' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Redis', icon: '🔴' },
  { name: 'React', icon: '⚛️' },
  { name: 'Vite', icon: '⚡' },
  { name: 'Tailwind', icon: '🎨' },
];

const COMMUNITY_CARDS = [
  {
    icon: Users,
    title: 'Kullanıcı & Üye Yönetimi',
    desc: 'Sistemdeki tüm kullanıcıları, profil fotoğraflarını ve durumlarını tek merkezden kolayca yönetin.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)'
  },
  {
    icon: Shield,
    title: 'Rol & Yetki Kuralları (RBAC)',
    desc: 'SUPER_ADMIN ve özel rol tanımları ile hassas modüllere erişimi güvenli şekilde kısıtlayın.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)'
  },
  {
    icon: ClipboardList,
    title: 'Audit Log & Canlı İzleme',
    desc: 'Gerçekleştirilen tüm ekleme, silme ve güncelleme işlemlerini anlık zaman damgasıyla takip edin.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)'
  },
];

const BLOG_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
    title: 'Node.js ve Redis ile Yüksek Hızlı Önbellekleme Mimarisi Kurmak',
  },
  {
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    title: 'SUPER_ADMIN ve RBAC İle Yetkisiz Erişimleri Engelleme Yolları',
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    title: 'Audit Log Kayıtları İle Sistem Güvenliğini Maksimuma Çıkarın',
  },
];

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
      {/* ─── 1. Header / Navbar ─── */}
      <header style={{
        height: '76px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px',
        position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={logoImg}
            alt="AdminPro Logo"
            style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
          />
          <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Admin<span style={{ color: '#10b981' }}>Pro</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <a href="#home" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Ana Sayfa</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Özellikler</a>
          <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Hakkımızda</a>
          <a href="#stats" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>İstatistikler</a>
          <a href="#blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Yazılar</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login">
            <button className="btn-secondary" style={{ padding: '9px 20px', fontSize: '14px', borderRadius: '8px' }}>
              Giriş Yap
            </button>
          </Link>
          <Link to="/register">
            <button style={{
              background: '#10b981', color: 'white', border: 'none', padding: '10px 22px',
              borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
            }}>
              Hemen Kayıt Ol <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </header>

      {/* ─── 2. Hero Section ─── */}
      <section id="home" style={{
        background: 'var(--bg-secondary)', padding: '80px 64px 100px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          maxWidth: '1240px', margin: '0 auto', display: 'grid',
          gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(38px, 4.8vw, 56px)', fontWeight: '900',
              lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '20px',
              color: 'var(--text-primary)'
            }}>
              8 Yıllık Deneyimle <br />
              <span style={{ color: '#10b981' }}>Yönetim ve Akıllı İçgörüler</span>
            </h1>

            <p style={{
              fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7',
              marginBottom: '36px', maxWidth: '520px'
            }}>
              Node.js, Express, MongoDB ve Redis altyapısıyla geliştirilmiş; JWT tabanlı Rol Bazlı Yetkilendirme (RBAC) ve canlı Audit Log takip sistemi.
            </p>

            <Link to="/register">
              <button style={{
                background: '#10b981', color: 'white', border: 'none', padding: '14px 36px',
                borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(16,185,129,0.35)', transition: 'transform 0.2s ease'
              }}>
                Kayıt Ol
              </button>
            </Link>

            <div style={{ display: 'flex', gap: '8px', marginTop: '48px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '10px', background: '#10b981' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '10px', background: 'var(--border)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '10px', background: 'var(--border)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{
              padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', width: '100%', maxWidth: '480px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '10px', background: '#ef4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '10px', background: '#f59e0b' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '10px', background: '#10b981' }} />
                </div>
                <span className="badge badge-success">v1.0.0 Canlıda</span>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Canlı İşlem Akışı</span>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>● Redis Aktif</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
                  {[35, 60, 45, 80, 50, 95, 75, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ width: '100%', height: `${h}%`, background: i % 2 === 0 ? '#10b981' : '#6366f1', borderRadius: '4px' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Toplam Audit Log</p>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>12,840</p>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RBAC Rolü</p>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: '#6366f1' }}>SUPER_ADMIN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Referanslar ve Teknolojiler ─── */}
      <section style={{ padding: '48px 64px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Referanslarımız & Güçlü Altyapımız
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Yüksek performanslı veritabanları ve modern web teknolojileri ile geliştirildi
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {CLIENT_LOGOS.map((client, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 24px', borderRadius: '12px', background: 'var(--bg-card)',
                border: '1px solid var(--border)', fontSize: '15px', fontWeight: '700',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ fontSize: '18px' }}>{client.icon}</span>
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Tüm Yönetim Sistemini Tek Ekrandan Yönetin ─── */}
      <section id="features" style={{ padding: '80px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)' }}>
            Tüm Yönetim Sistemini <br /> Tek Ekrandan Yönetin
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '56px' }}>
            AdminPro platformu projeniz için hazır hangi çözümleri sunar?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {COMMUNITY_CARDS.map((card, idx) => (
              <div key={idx} className="card" style={{
                padding: '36px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '16px', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px', background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <card.icon size={28} color={card.color} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Split Section 1 ─── */}
      <section id="about" style={{ padding: '80px 64px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '64px', alignItems: 'center' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&auto=format&fit=crop&q=80"
              alt="Yönetim Görseli"
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Pixel-Perfect Tasarım ve <br /> Yüksek Güvenlik Mimarisi
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '28px' }}>
              Projemiz Node.js Express backend API altyapısı ile MongoDB veritabanı ilişkilerini optimum seviyede yönetir. Redis önbellekleme ve SUPER_ADMIN yetki kontrolleri ile güvenliği en üst düzeye çıkarır.
            </p>
            <Link to="/register">
              <button style={{
                background: '#10b981', color: 'white', border: 'none', padding: '12px 28px',
                borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
              }}>
                Detaylı Bilgi Al
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. Performans Metrikleri ─── */}
      <section id="stats" style={{ padding: '80px 64px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Sisteminize Değer Katan <br />
              <span style={{ color: '#10b981' }}>Performans Metrikleri</span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Yüksek veri trafiği ve hızlı yanıt süreleriyle kesintisiz altyapı
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {[
              { icon: Users, label: 'Aktif Kullanıcılar', value: '2,245,341', color: '#10b981' },
              { icon: Building, label: 'Rol & Yetki Kuralları', value: '46,328', color: '#6366f1' },
              { icon: Zap, label: 'Redis Önbellek İstekleri', value: '828,867', color: '#f59e0b' },
              { icon: CreditCard, label: 'Audit Log Kaydı', value: '1,926,436', color: '#ec4899' },
            ].map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <stat.icon size={36} color={stat.color} />
                <div>
                  <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{stat.value}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Split Section 2 ─── */}
      <section style={{ padding: '80px 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Güçlü API, Canlı Arama ve <br /> Bildirim Yönetimi
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '28px' }}>
              Gelişmiş canlı arama, profil düzenleme, kapak resmi (banner) ve bildirim kutusu sistemimizle paneli kesintisiz kullanın. Tarihe göre audit log süzme ve dışa aktarma seçenekleriyle verilerinize hakim olun.
            </p>
            <Link to="/login">
              <button style={{
                background: '#10b981', color: 'white', border: 'none', padding: '12px 28px',
                borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
              }}>
                Daha Fazla Oku
              </button>
            </Link>
          </div>

          <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80"
              alt="Dashboard Analitik"
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ─── 8. Müşteri Görüşleri (Tesla Alıntısı) ─── */}
      <section style={{ padding: '80px 64px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'center' }}>
          <div style={{
            height: '200px', background: '#090a0f', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: '40px', fontWeight: '900', color: 'white', letterSpacing: '4px' }}>TESLA</span>
          </div>

          <div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
              “AdminPro altyapısı sayesinde tüm yetkilendirme, SUPER_ADMIN koruması ve audit log süreçlerimizi saniyeler içinde yapılandırdık. Veritabanı ve Redis önbellek performansından son derece memnunuz.”
            </p>
            <p style={{ fontSize: '16px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>Tim Smith</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Kurumsal Sistem Yöneticisi</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>
                <span>Node.js</span><span>Express</span><span>MongoDB</span><span>Redis</span>
              </div>
              <a href="#features" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Tüm Başarı Hikayelerini İncele <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Blog ve Yenilikler ─── */}
      <section id="blog" style={{ padding: '80px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)' }}>
            En Son Yenilikler ve Mühendislik Makaleleri
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 56px' }}>
            AdminPro blogunda sistem mimarisi, güvenlik standartları ve Redis caching pratiklerini keşfedin.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {BLOG_POSTS.map((post, idx) => (
              <div key={idx} style={{ position: 'relative', paddingBottom: '40px' }}>
                <div style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card" style={{
                  position: 'absolute', bottom: 0, left: '20px', right: '20px',
                  padding: '20px', background: 'var(--bg-card)', borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                  textAlign: 'left'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.4', marginBottom: '12px', color: 'var(--text-primary)' }}>
                    {post.title}
                  </h4>
                  <a href="#home" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Devamını Oku <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. CTA Footer Banner ─── */}
      <section style={{ padding: '80px 64px', background: 'var(--bg-secondary)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '32px', color: 'var(--text-primary)', letterSpacing: '-1px' }}>
            Yönetim Panelinizi Şimdi <br /> Kurmaya Başlayın
          </h2>
          <Link to="/register">
            <button style={{
              background: '#10b981', color: 'white', border: 'none', padding: '14px 36px',
              borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 6px 24px rgba(16,185,129,0.35)'
            }}>
              Ücretsiz Deneyin <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── 11. Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '60px 64px 40px',
        background: 'var(--bg-primary)', color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1240px', margin: '0 auto', display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px', marginBottom: '48px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img
                src={logoImg}
                alt="AdminPro Logo"
                style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>AdminPro</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', maxWidth: '300px' }}>
              Telif Hakkı © 2026 AdminPro. <br /> Tüm Hakları Saklıdır.
            </p>
          </div>

          <div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Kurumsal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Hakkımızda</a>
              <a href="#blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Yazılar</a>
              <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>İletişim</a>
              <a href="#stats" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Fiyatlandırma</a>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Destek</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Yardım Merkezi</a>
              <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kullanım Koşulları</a>
              <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Yasal Haklar</a>
              <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Gizlilik Politikası</a>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Bültene Abone Olun</p>
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 6px 4px 12px' }}>
              <input
                placeholder="E-posta adresiniz"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }}
              />
              <button style={{ background: '#10b981', border: 'none', color: 'white', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
