import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#8C1D40', fontSize: '1.8rem', textAlign: 'center' }}>
          Welcome, {user.asurite || user.staffId || 'User'}!
        </h2>

        <p style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>{user.email}</p>

        {user.role && <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Role: {user.role}</p>}

        <button onClick={handleLogout} style={{ marginTop: '0.5rem', width: '100%', padding: '0.6rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}