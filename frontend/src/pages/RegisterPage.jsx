import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

const RegisterPage = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', phone_number: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await register(form);
      setSuccess(res.message || 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', animation: 'fadeIn 0.4s ease', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img
            src={logoImg}
            alt="AdminPro Logo"
            style={{
              width: '64px', height: '64px',
              borderRadius: '10px',
              objectFit: 'cover',
              margin: '0 auto 16px',
              display: 'block',
              boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
            }}
          />
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Hesap Oluştur
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Yeni hesabınızı oluşturmak için formu doldurun
          </p>
        </div>

        <div className="glass" style={{ borderRadius: '20px', padding: '32px' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            }}>
              <AlertCircle size={16} color="var(--error)" />
              <span style={{ fontSize: '14px', color: 'var(--error)' }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            }}>
              <CheckCircle size={16} color="var(--success)" />
              <span style={{ fontSize: '14px', color: 'var(--success)' }}>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Ad *</label>
                <input className="input-field" placeholder="Adınız" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Soyad</label>
                <input className="input-field" placeholder="Soyadınız" value={form.last_name} onChange={set('last_name')} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>E-Posta *</label>
              <input className="input-field" type="email" placeholder="ornek@email.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Telefon</label>
              <input className="input-field" placeholder="+90 5xx xxx xx xx" value={form.phone_number} onChange={set('phone_number')} />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Şifre *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={set('password')}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', borderRadius: '10px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              ) : (
                <>
                  <UserPlus size={18} />
                  Hesap Oluştur
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Zaten hesabınız var mı?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>
              Giriş Yap
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
