import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  //first we need to grab all of our categories so that we can split them up so its easier for the viewer to see
  //We also give them option to view All of the events at once
  const categories = ['All', ...new Set(events.map((event) => event.categorytype))];

  //here we are just filtering based on selected category
  const filteredEvents =
  //show all events
    selectedCategory === 'All'
      ? events
      //otherwise show the selected event 
      : events.filter((event) => event.categorytype === selectedCategory);
  //This is where we get the events - from our backend database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        //here is our request to backend for the events
        const response = await fetch('http://localhost:3001/events');
        //did not work so throw error
        if (!response.ok) {
          throw new Error('Failed to grab the events');
        }
        const data = await response.json();
        //here is where we store the events from our backend
        setEvents(data);
      }
      catch (err) {
        setError('Error getting events');
      }
      finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#fff',
        fontFamily: 'sans-serif',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '900px',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#8C1D40',
              fontSize: '1.8rem',
              textAlign: 'center',
            }}
          >
            Welcome, {user.asurite || user.staffId || 'User'}!
          </h2>

          <p style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>
            {user.email}
          </p>

          {user.role && (
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Role: {user.role}
            </p>
          )}

          <button
            onClick={handleLogout}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              maxWidth: '220px',
              padding: '0.6rem',
              background: '#8C1D40',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#8C1D40' }}>Available Events</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && filteredEvents.length === 0 && (
            <p>No events found check to ensure DB imported</p>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="categoryFilter"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}
            >
              Filter by Category
            </label>

            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.6rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                width: '220px',
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {!loading && !error && events.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredEvents.map((event) => (
                <div
                  key={event.eventid}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <h4 style={{ margin: '0.25rem 0' }}>
                    <strong></strong> {event.categorytype}
                  </h4>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Location:</strong> {event.eventlocation}
                  </p>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Time:</strong>{' '}
                    {new Date(event.eventtime).toLocaleString()}
                  </p>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Status:</strong> {event.status}
                  </p>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Max Tickets Per Student:</strong> {event.maxticketsperstudent}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}