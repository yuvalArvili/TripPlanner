import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

function SaveTripForm({ coordinates, type, day1 = [], day2 = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const formattedCoordinates = formatPoints(coordinates);
    const formattedDay1 = formatPoints(day1);
    const formattedDay2 = formatPoints(day2);

    try {
      await axios.post('/api/trips', {
        name,
        description,
        type,
        coordinates: formattedCoordinates,
        day1: type === 'cycling' ? formattedDay1 : [],
        day2: type === 'cycling' ? formattedDay2 : []
      }, {
        headers: { Authorization: `Bearer ${token}` }
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