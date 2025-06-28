import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Weather from '../components/Weather';
import '../styles/TripDetails.css'; // Styling for cards and layout
import { useRef } from 'react';

// Calculate distance using Haversine formula
function getDistanceFromLatLonKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null); 


  // Fetch trip data
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

  // Draw map and calculate distance
useEffect(() => {
    if (!trip) return;

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map('trip-map', {
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

      let total = 0;
      for (let i = 0; i < allPoints.length - 1; i++) {
        total += getDistanceFromLatLonKm(
          allPoints[i][0], allPoints[i][1],
          allPoints[i + 1][0], allPoints[i + 1][1]
        );
      }
      setDistance(total.toFixed(2));
    }, 100);
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

      {/* Card 2 – Route Map */}
      <div className="card">
        <h3>Route Map</h3>
        <div id="trip-map" className="trip-map" />
      </div>

      {/* Card 3 – Weather Forecast */}
      {trip.coordinates?.length > 0 && (
        <div className="card">
          <div className='weather-info'>
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
