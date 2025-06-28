import React, { useEffect, useState } from 'react';

function Weather({ lat, lon }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    async function fetchForecast() {
      if (!lat || !lon) return;

      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Select one forecast per day (every 8 items ≈ 24 hours)
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3); 
        setForecast(dailyForecasts);
      } catch (error) {
        console.error("Error fetching weather forecast:", error);
      }
    }

    fetchForecast();
  }, [lat, lon]);

  return (
    <div>
      <h3>3-Day Weather Forecast</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        {forecast.map((day, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '6px' }}>
            <h4>{new Date(day.dt_txt).toLocaleDateString('en-US')}</h4>
            <p>{day.weather[0].description}</p>
            <p>🌡 {day.main.temp}°C</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Weather;
