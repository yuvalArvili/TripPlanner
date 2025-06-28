import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PlanRoute.css';
import { calculateRouteDistanceKm } from '../utils/distance';
import { fetchCyclingRouteWithRetry } from './CyclingRoute';
import { fetchHikingRouteWithRetry } from './HikingRoute';
import Weather from '../components/Weather';
import DestinationImage from '../components/DestinationImage';
import SaveTripForm from '../components/SaveTripForm';

// Component to handle map fly-to functionality
function MapFlyTo({ center }) {
  const map = useMap();
  map.flyTo(center, map.getZoom());
  return null;
}

// Main component for planning a trip
function PlanRoute() {
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [day1Coordinates, setDay1Coordinates] = useState([]);
  const [day2Coordinates, setDay2Coordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState([32.0853, 34.7818]);
  const [dayDistances, setDayDistances] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [showImage, setShowImage] = useState(false);

  // Function to handle form submission and route generation
  // It checks the trip type and fetches the appropriate route
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!destination || !tripType) {
      alert('Please select a valid destination and trip type.');
      return;
    }

    try {
      if (tripType === 'Cycling') {
        const { fullRoute, day1, day2, startPoint } = await fetchCyclingRouteWithRetry(destination);
        setStartPoint(startPoint);
        setMapCenter(startPoint);

        setRouteCoordinates(fullRoute);
        setDay1Coordinates(day1);
        setDay2Coordinates(day2);
        setDayDistances([
          calculateRouteDistanceKm(day1),
          calculateRouteDistanceKm(day2),
        ]);
      } else if (tripType === 'Hiking') {
        const { route, startPoint } = await fetchHikingRouteWithRetry(destination);
        setStartPoint(startPoint);
        setMapCenter(startPoint);

        setRouteCoordinates(route);
        setDay1Coordinates([]);
        setDay2Coordinates([]);
        setDayDistances([calculateRouteDistanceKm(route)]);
      }

      setShowImage(true);
    } catch (error) {
      console.error('Route generation failed:', error);
      alert('Could not generate route. Try again.');
      // Reset state if route generation fails
    }
  };

  // Main container for the PlanRoute component
  return (
    <div>
      <div className="plan-container">
        <div className="top-row">
          <div className="card form-card">
            <h2>Plan Trip</h2>
            <form onSubmit={handleSubmit} className="trip-form">
              <label>
                City
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Jerusalem"
                />
              </label>

              <label>
                Trip Type
                <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Cycling">Cycling</option>
                </select>
              </label>

              <button type="submit">Plan Trip</button>
            </form>
          </div>

          <div className="card map-card">
            <MapContainer center={mapCenter} zoom={13} className="map-container">
              <MapFlyTo center={mapCenter} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {tripType === 'Cycling' && (
                <>
                  <Polyline positions={day1Coordinates} color="blue" />
                  <Polyline positions={day2Coordinates} color="green" />
                </>
              )}
              {tripType === 'Hiking' && routeCoordinates.length > 0 && (
                <Polyline positions={routeCoordinates} color="blue" />
              )}
            </MapContainer>

            {dayDistances.length > 0 && (
              <div className="distance-info">
                {dayDistances.map((d, i) => (
                  <div key={i}>Day {i + 1} distance: {d} km</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {routeCoordinates.length > 0 && (
            <div className="bottom-row">
              <div className="card forecast-card">
                {startPoint && (
                  <Weather lat={startPoint[0]} lon={startPoint[1]} />
                )}
              </div>

              <div className="card image-card">
                {showImage && destination && (
                  <DestinationImage key={destination} destination={destination} />
                )}
              </div>

              <div className="card save-trip-card">
                <SaveTripForm
                  coordinates={routeCoordinates}
                  type={tripType.toLowerCase()}
                  day1={day1Coordinates}
                  day2={day2Coordinates}
                />
              </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default PlanRoute;