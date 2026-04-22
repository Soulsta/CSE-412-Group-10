import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const emptyEventForm = {
    eventLocation: '',
    eventTime: '',
    releaseStart: '',
    releaseEnd: '',
    capacity: '',
    categoryType: 'Football',
    status: 'Scheduled',
  };
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventError, setEventError] = useState('');

  useEffect(() => {
    if (!user.staffId) {
      navigate('/');
      return;
    }
    fetchStudents();
    fetchEvents();
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

  const toLocalDatetime = (s) => {
    if (!s) return '';
    const d = new Date(s);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/events');
      const data = await res.json();
      if (!res.ok) {
        setEventError(data.message || 'Failed to load events.');
      } else {
        setEvents(data);
      }
    } catch (err) {
      setEventError('Network error. Please try again.');
    }
  };

  const handleEventField = (field, value) => {
    setEventForm({ ...eventForm, [field]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setEventError('');

    try {
      if (editingEvent) {
        const body = {};
        const editableFields = ['eventLocation', 'eventTime', 'releaseStart', 'releaseEnd', 'capacity', 'status'];
        const originalMap = {
          eventLocation: editingEvent.eventlocation,
          eventTime: toLocalDatetime(editingEvent.eventtime),
          releaseStart: toLocalDatetime(editingEvent.releasestart),
          releaseEnd: toLocalDatetime(editingEvent.releaseend),
          capacity: String(editingEvent.capacity),
          status: editingEvent.status,
        };
        for (const field of editableFields) {
          const current = String(eventForm[field] ?? '');
          const original = String(originalMap[field] ?? '');
          if (current !== original) {
            body[field] = field === 'capacity' ? Number(eventForm[field]) : eventForm[field];
          }
        }

        if (Object.keys(body).length === 0) {
          resetEventForm();
          return;
        }

        const res = await fetch(`http://localhost:3001/api/admin/events/${editingEvent.eventid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setEventError(data.message || 'Failed to update event.');
          return;
        }
      } else {
        const body = {
          eventLocation: eventForm.eventLocation,
          eventTime: eventForm.eventTime,
          releaseStart: eventForm.releaseStart,
          releaseEnd: eventForm.releaseEnd,
          capacity: Number(eventForm.capacity),
          maxTicketsPerStudent: 1,
          status: eventForm.status,
          categoryType: eventForm.categoryType,
          staffId: user.staffId,
        };
        const res = await fetch('http://localhost:3001/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setEventError(data.message || 'Failed to create event.');
          return;
        }
      }

      resetEventForm();
      await fetchEvents();
    } catch (err) {
      setEventError('Network error. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      eventLocation: event.eventlocation,
      eventTime: toLocalDatetime(event.eventtime),
      releaseStart: toLocalDatetime(event.releasestart),
      releaseEnd: toLocalDatetime(event.releaseend),
      capacity: String(event.capacity),
      categoryType: event.categorytype,
      status: event.status,
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Delete this event?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEventError(data.message || 'Failed to delete event.');
        return;
      }
      if (editingEvent && editingEvent.eventid === eventId) {
        resetEventForm();
      }
      await fetchEvents();
    } catch (err) {
      setEventError('Network error. Please try again.');
    }
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventForm(emptyEventForm);
    setEventError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px', gap: '1rem' }}>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ margin: 0, color: '#8C1D40', fontSize: '1.4rem' }}>Event Management</h3>

          {eventError && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{eventError}</p>}

          <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ margin: 0, color: '#374151' }}>
              {editingEvent ? `Edit Event #${editingEvent.eventid}` : 'Create Event'}
            </h4>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Location
              <input
                type="text"
                required
                value={eventForm.eventLocation}
                onChange={(e) => handleEventField('eventLocation', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Event Time
              <input
                type="datetime-local"
                required
                value={eventForm.eventTime}
                onChange={(e) => handleEventField('eventTime', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Release Start
              <input
                type="datetime-local"
                required
                value={eventForm.releaseStart}
                onChange={(e) => handleEventField('releaseStart', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Release End
              <input
                type="datetime-local"
                required
                value={eventForm.releaseEnd}
                onChange={(e) => handleEventField('releaseEnd', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Capacity
              <input
                type="number"
                min="1"
                required
                value={eventForm.capacity}
                onChange={(e) => handleEventField('capacity', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Category
              <select
                value={eventForm.categoryType}
                onChange={(e) => handleEventField('categoryType', e.target.value)}
                disabled={!!editingEvent}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              >
                {['Football', 'Basketball', 'Baseball', 'Soccer', 'Volleyball', 'Swimming'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', color: '#374151' }}>
              Status
              <select
                value={eventForm.status}
                onChange={(e) => handleEventField('status', e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.95rem' }}
              >
                {['Scheduled', 'Completed', 'Canceled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                style={{ padding: '0.6rem 1rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              {editingEvent && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  style={{ padding: '0.6rem 1rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {events.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No events found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #8C1D40', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Event ID</th>
                    <th style={{ padding: '0.5rem' }}>Category</th>
                    <th style={{ padding: '0.5rem' }}>Location</th>
                    <th style={{ padding: '0.5rem' }}>Time</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem' }}>Tickets</th>
                    <th style={{ padding: '0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.eventid} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem' }}>{ev.eventid}</td>
                      <td style={{ padding: '0.5rem' }}>{ev.categorytype}</td>
                      <td style={{ padding: '0.5rem' }}>{ev.eventlocation}</td>
                      <td style={{ padding: '0.5rem' }}>{new Date(ev.eventtime).toLocaleString()}</td>
                      <td style={{ padding: '0.5rem' }}>{ev.status}</td>
                      <td style={{ padding: '0.5rem' }}>{ev.ticketsclaimed} / {ev.capacity}</td>
                      <td style={{ padding: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                        <button
                          onClick={() => handleEditEvent(ev)}
                          style={{ padding: '0.3rem 0.6rem', background: '#8C1D40', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.eventid)}
                          style={{ padding: '0.3rem 0.6rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
