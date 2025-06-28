import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HistoryPage.css'; 

//main component for displaying saved trips
//// It fetches trips from the backend and displays them in a list
function HistoryPage() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {// Get the token from localStorage
        // and fetch trips from the backend
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/trips', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTrips(res.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="history-wrapper">
      <h2 className="history-header">Saved Trips</h2>
      <div className="trips-container">
        {trips.length === 0 ? (
          <p className="no-trips">No saved trips found.</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="trip-item">
              <div className="trip-text">
                <div className="trip-title">{trip.name}</div>
                <div className="trip-desc">{trip.description}</div>
              </div>
              <button
                className="view-button"
                onClick={() => navigate(`/trip/${trip._id}`)}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
