import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({ title, apiEndpoint }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        navigate(data.staffId ? '/admin/home' : '/home');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '0.5rem', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 1rem', color: '#8C1D40', fontSize: '1.8rem', textAlign: 'center' }}>{title}</h2>

      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />

      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />

      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.6rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

function RegisterForm({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
      } else {
        alert('Account created successfully! You can now sign in.');
        onClose();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '0.5rem', padding: '2rem', border: '2px solid #8C1D40', borderRadius: '8px', marginTop: '1rem' }}>
      <h2 style={{ margin: '0 0 1rem', color: '#8C1D40', fontSize: '1.8rem', textAlign: 'center' }}>Create Account</h2>

      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />

      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />

      <label>Confirm Password</label>
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />

      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.6rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>

      <button type="button" onClick={onClose} style={{ padding: '0.6rem', background: '#fff', color: '#8C1D40', border: '1px solid #8C1D40', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
        Cancel
      </button>
    </form>
  );
}

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'sans-serif', gap: '1.5rem' }}>
      <h1 style={{ color: '#8C1D40', fontSize: '3rem', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>Welcome!</h1>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <LoginForm title="Sign In as Student" apiEndpoint="http://localhost:3001/api/login" />
        <LoginForm title="Sign In as Admin" apiEndpoint="http://localhost:3001/api/admin/login" />
      </div>

      {!showRegister && (
        <button onClick={() => setShowRegister(true)} style={{ padding: '0.6rem 2rem', background: '#fff', color: '#8C1D40', border: '2px solid #8C1D40', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
          Create an Account
        </button>
      )}

      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}