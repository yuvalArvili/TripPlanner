import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Weather from '../components/Weather';
import '../styles/TripDetails.css';
import { calculateRouteDistanceKm } from '../utils/distance';

// This component displays detailed information about a specific trip
// It fetches trip data from the backend, displays it, and shows a map with the
function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);

  // Fetch trip data from backend
  useEffect(() => {
    const fetchTrip = async () => {
try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTrip(res.data);
    } catch (err) {
      console.error('Error loading trip:', err);
    }
  };

  fetchTrip();
}, [id]);

  // Create map and calculate distance
  useEffect(() => {
    if (!trip) return;

    requestAnimationFrame(() => {
      const mapContainer = document.getElementById('trip-map');
      if (!mapContainer) return;

      // Clean up old map
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Create map
      const map = L.map(mapContainer, {
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        touchZoom: true,
      });

      mapRef.current = map;
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add markers for trip start and end points - building route on the map
      let allPoints = [];
      

      if (trip.type === 'cycling' && trip.day1?.length && trip.day2?.length) {
        const day1 = trip.day1.map(p => [p.lat, p.lng]);
        const day2 = trip.day2.map(p => [p.lat, p.lng]);
        L.polyline(day1, { color: 'blue' }).addTo(map);
        L.polyline(day2, { color: 'green' }).addTo(map);
        allPoints = [...day1, ...day2];
        map.setView(day1[0], 13);
      } else if (trip.coordinates?.length > 1) {
        const coords = trip.coordinates.map(p => [p.lat, p.lng]);
        L.polyline(coords, { color: 'blue' }).addTo(map);
        allPoints = coords;
        map.setView(coords[0], 13);
      }

      setDistance(calculateRouteDistanceKm(allPoints)); // Calculate total distance
    });
  }, [trip]);

  if (!trip) return <p>Loading trip...</p>;

  return (
   <div className="trip-details-wrapper">
      {/* Card 1 – Trip Info */}
      <div className="card">
        <h2>{trip.name}</h2>
        <br></br>
        <div className='trip-info'>
        <p><strong>Description:</strong> {trip.description}</p>
        <br></br>
        <p><strong>Created:</strong> {new Date(trip.createdAt).toLocaleDateString()}</p>
        <br></br>
        {distance && <p><strong>Total Distance:</strong> {distance} km</p>}
        <br></br>
        </div>
      </div>

      {/* Map Card */}
      <div className="card">
        <h3>Route Map</h3>
        <div id="trip-map" className="trip-map" />
      </div>

      {/* Weather Forecast Card */}
      {trip.coordinates?.length > 0 && (
        <div className="card">
          <div className="weather-info">
            <Weather
              lat={trip.coordinates[0].lat}
              lon={trip.coordinates[0].lng}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetails;