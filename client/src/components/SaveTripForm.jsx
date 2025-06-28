import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

// This component allows users to save a trip with coordinates and optional cycling routes
// It includes a form for trip name and description, and handles submission to the backend
function SaveTripForm({ coordinates, type, day1 = [], day2 = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth();

  // Handle form submission to save the trip
  // It formats the coordinates and sends a POST request to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all points are valid
    const formatPoints = (pointsArray) => pointsArray.map(p => { 
      if (Array.isArray(p)) {
        return { lat: p[0], lng: p[1] };
      } else if (typeof p === 'object' && 'lat' in p && 'lng' in p) {
        return p;
      } else {
        console.warn("Invalid coordinate format:", p);
        return null;
      }
    }).filter(Boolean);

    // Format coordinates and optional cycling route
    const formattedCoordinates = formatPoints(coordinates);
    const formattedDay1 = formatPoints(day1);
    const formattedDay2 = formatPoints(day2);

    // send the trip data to the backend- to DB
    try {
      await axios.post('/api/trips', {
        name,
        description,
        type,
        coordinates: formattedCoordinates,
        day1: type === 'cycling' ? formattedDay1 : [], // Ensure day1 and day2 is only included for cycling trips
        day2: type === 'cycling' ? formattedDay2 : []
      }, {
        headers: { Authorization: `Bearer ${token} `}
      });

      alert('Trip saved successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Error saving trip:', err);
      alert('Error saving trip');
    }
  };

  
  return (
    <form className="save-trip-form" onSubmit={handleSubmit}>
      <label>
        Trip name
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Trip name" 
          required 
        />
      </label>

      <label>
        Short description
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="e.g., Scenic 2-day trail near Haifa"
        />
      </label>

      <button type="submit">Save Trip</button>
    </form>
  );
}

export default SaveTripForm;