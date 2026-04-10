import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user.staffId) {
      navigate('/');
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/admin/students');
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to load students.');
      } else {
        setStudents(data);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (asurite) => {
    if (!confirm(`Delete student "${asurite}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/admin/students/${asurite}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to delete student.');
      } else {
        setStudents(students.filter((s) => s.asurite !== asurite));
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '600px', gap: '1rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#8C1D40', fontSize: '1.8rem', textAlign: 'center' }}>
            Welcome, Admin {user.staffId}!
          </h2>
          <p style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>{user.email}</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Role: {user.role}</p>
          <button onClick={handleLogout} style={{ marginTop: '0.5rem', width: '100%', padding: '0.6rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, color: '#8C1D40', fontSize: '1.4rem' }}>Registered Students</h3>

          {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Loading...</p>
          ) : students.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No students found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #8C1D40', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>ASURITE</th>
                  <th style={{ padding: '0.5rem' }}>Email</th>
                  <th style={{ padding: '0.5rem' }}>Eligible</th>
                  <th style={{ padding: '0.5rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.asurite} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.5rem' }}>{s.asurite}</td>
                    <td style={{ padding: '0.5rem' }}>{s.email}</td>
                    <td style={{ padding: '0.5rem' }}>{s.eligible ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => handleDelete(s.asurite)} style={{ padding: '0.3rem 0.6rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
