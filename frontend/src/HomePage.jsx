import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //Logout button removes user from local storage and redirects to login
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const categories = ['All', ...new Set(events.map((event) => event.categorytype))];

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((event) => event.categorytype === selectedCategory);

  //Importing Events data
  const fetchEvents = async (dir = sortDir) => {
    try {
      const response = await fetch(`http://localhost:3001/api/events?sort=${dir}`);
      if (!response.ok) {
        throw new Error('Failed to grab the events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Error getting events');
    } finally {
      setLoading(false);
    }
  };

  //Importing tickets data
  const fetchTickets = async () => {
    if (!user.asurite) return;
    try {
      const response = await fetch(`http://localhost:3001/api/tickets/${user.asurite}`);
      if (!response.ok) return;
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchEvents(sortDir);
    fetchTickets();
  }, []);

  const toggleSort = async () => {
    const next = sortDir === 'asc' ? 'desc' : 'asc';
    setSortDir(next);
    await fetchEvents(next);
  };

  //Ticket claiming handler
  const handleClaim = async (eventId) => {
    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, asurite: user.asurite }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.message || 'Failed to claim ticket.');
        return;
      }
      await fetchEvents(sortDir);
      await fetchTickets();
    } catch (err) {
      alert('Failed to claim ticket.');
    }
  };

  //Ticket cancellation handler
  const handleReturn = async (ticketId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.message || 'Failed to return ticket.');
        return;
      }
      await fetchEvents(sortDir);
      await fetchTickets();
    } catch (err) {
      alert('Failed to return ticket.');
    }
  };

  return (
    {/*UI portion of Logout button handler*/}
    <div
      style={{minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff',
        fontFamily: 'sans-serif', padding: '2rem', boxSizing: 'border-box',}}
    >
      <div
        style={{display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px',gap: '1rem',}}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb',
            borderRadius: '8px',alignItems: 'center',}}
        >
          <h2
            style={{margin: 0, color: '#8C1D40', fontSize: '1.8rem', textAlign: 'center',}}
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
            style={{marginTop: '0.5rem', width: '100%', maxWidth: '220px', padding: '0.6rem', background: '#8C1D40', color: '#fff',
              border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer',}}
          >
            Logout
          </button>
        </div>

        {/*Event Storting handler*/}
        <div
          style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem',}}
        >
          <h3 style={{ marginTop: 0, color: '#8C1D40' }}>Available Events</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && filteredEvents.length === 0 && (
            <p>No events found check to ensure DB imported</p>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={toggleSort}
              style={{padding: '0.6rem 1rem', background: '#8C1D40', color: '#fff', border: 'none',
                borderRadius: '4px', fontSize: '1rem', cursor: 'pointer',}}
            >
              Sort by Time: {sortDir === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
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
              style={{padding: '0.6rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem', width: '220px',}}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/*UI for Ticket claim handler*/}
          {!loading && !error && events.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredEvents.map((event) => (
                <div
                  key={event.eventid}
                  style={{border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', backgroundColor: '#f9fafb',}}
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

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Tickets Remaining:</strong> {event.ticketsremaining} / {event.capacity}
                  </p>

                  {Number(event.ticketsremaining) === 0 && (
                    <p style={{ margin: '0.25rem 0', color: 'red', fontWeight: 'bold' }}>
                      Sold Out
                    </p>
                  )}

                  {event.status === 'Scheduled' && Number(event.ticketsremaining) > 0 && (
                    <button
                      onClick={() => handleClaim(event.eventid)}
                      style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#8C1D40', color: '#fff',
                        border: 'none', borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer',}}
                    >
                      Claim Ticket
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/*Handles UI portion of ticket return*/}
        <div
          style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem',}}
        >
          <h3 style={{ marginTop: 0, color: '#8C1D40' }}>My Tickets</h3>
          {tickets.length === 0 ? (
            <p>You haven't claimed any tickets yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticketid}
                  style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', backgroundColor: '#f9fafb',}}
                >
                  <h4 style={{ margin: '0.25rem 0' }}>{ticket.categorytype}</h4>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Location:</strong> {ticket.eventlocation}
                  </p>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Time:</strong>{' '}
                    {new Date(ticket.eventtime).toLocaleString()}
                  </p>

                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Status:</strong> {ticket.status}
                  </p>

                  <button
                    onClick={() => handleReturn(ticket.ticketid)}
                    style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#8C1D40', color: '#fff',
                      border: 'none', borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer',}}
                  >
                    Return Ticket
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
