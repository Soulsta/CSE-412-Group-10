import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asuLogo from './asu-logo.png';

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

    //Web request here
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

  //Textfield and button creation for existing user Login Page
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '0.5rem', padding: '2rem', border: '1px solid #FFC627', borderRadius: '8px', background: 'rgba(255,255,255,0.08)' }}>
      <h2 style={{ margin: '0 0 1rem', color: '#FFC627', fontSize: '1.8rem', textAlign: 'center' }}>{title}</h2>

      {error && <p style={{ color: '#FFC627', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

      <label style={{ color: '#fff' }}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ padding: '0.5rem', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />

      <label style={{ color: '#fff' }}>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />

      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.6rem', background: '#FFC627', color: '#8C1D40', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

//Register Page creation here
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

  //Textfield and button creation for Register Page
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '0.5rem', padding: '2rem', border: '2px solid #FFC627', borderRadius: '8px', background: 'rgba(255,255,255,0.08)' }}>
      <h2 style={{ margin: '0 0 1rem', color: '#FFC627', fontSize: '1.8rem', textAlign: 'center' }}>Create Account</h2>

      {error && <p style={{ color: '#ffaaaa', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

      <label style={{ color: '#fff' }}>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ padding: '0.5rem', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />

      <label style={{ color: '#fff' }}>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />

      <label style={{ color: '#fff' }}>Confirm Password</label>
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••" style={{ padding: '0.5rem', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />

      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.6rem', background: '#FFC627', color: '#8C1D40', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>

      <button type="button" onClick={onClose} style={{ padding: '0.6rem', background: 'transparent', color: '#FFC627', border: '1px solid #FFC627', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
        Cancel
      </button>
    </form>
  );
}

//These are images that will always be displayed
//whether the user is directed to the Register (new user) or Login (existing user)
export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#8C1D40', fontFamily: 'sans-serif', gap: '1.5rem', padding: '2rem', overflow: 'hidden' }}>

      {/* Background logo */}
      <img src={asuLogo} alt="" style={{ position: 'absolute', width: '30%', opacity: 0.15, zIndex: 0, pointerEvents: 'none', filter: 'blur(2px)' }} />

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
        <h1 style={{ color: '#FFC627', fontSize: '3rem', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>Welcome!</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <LoginForm title="Sign In as Student" apiEndpoint="http://localhost:3001/api/login" />
          <LoginForm title="Sign In as Admin" apiEndpoint="http://localhost:3001/api/admin/login" />
        </div>

        {!showRegister && (
          <button onClick={() => setShowRegister(true)} style={{ padding: '0.6rem 2rem', background: 'transparent', color: '#FFC627', border: '2px solid #FFC627', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
            Create an Account
          </button>
        )}

        {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
      </div>
    </div>
  );
}
