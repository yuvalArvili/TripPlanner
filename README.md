# Personal Trip Planner

A full-stack web application that allows users to plan realistic travel routes based on location and trip type (cycling or hiking), view weather forecasts, get a destination image, and save personal routes.

---

## Technologies Used

- **Frontend:** React, JavaScript, HTML5, CSS3, Leaflet.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **External APIs:**
  - OpenRouteService – realistic route generation
  - Groq LLM – GPS points generation via language model
  - OpenWeatherMap – weather forecast API
  - Unsplash – destination image API

---

## Getting Started – Local Setup

### Server
To run the backend server:

```bash
cd server
npm install
# Create a .env file in the server folder with the following:
# (Replace the values with your own)
.env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

Then start the server:

```bash
node server.js
```

---

### Client
To run the React frontend:

```bash
cd client
npm install
# Create a .env file in the client folder with the following:
# (Replace the values with your own)
.env
REACT_APP_GROQ_API_KEY=your_groq_api_key
REACT_APP_ORS_API_KEY=your_openrouteservice_key
REACT_APP_WEATHER_API_KEY=your_openweathermap_key
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

Then start the client:

```bash
npm start
```

---

## Features

### Trip Planning
- **Cycling trips** – Two-day route (city-to-city), up to 60 km per day
- **Hiking trips** – Round-trip walking route (up to 15 km total)
- **Route is displayed on an interactive map** using Leaflet

### AI-Generated Points
- Groq LLM generates GPS coordinates for the requested destination and trip type
- If invalid coordinates are returned (e.g., middle of the ocean), the system retries up to 5 times

### Real Routing & Distance Calculation
- OpenRouteService is used to build real-world paths on roads/trails
- Each day's distance is calculated and displayed in km

### Weather Forecast
- Fetches 3-day weather forecast for the trip’s starting point (via OpenWeatherMap)

### Destination Image
- Displays a representative image of the city or country (real or AI-generated)

### Save and Load Trips
- Users can register and log in
- Planned trips are saved to MongoDB and associated with the logged-in user
- Saved trips can be viewed and reloaded from a personal history page

---

## Authentication

- **JWT-based login system**
- User passwords are securely stored with hashing + salt (bcrypt)
- Saved trips are private and accessible only to the logged-in user who created them

---

## Known Bugs & Limitations

- AI may return GPS points in the sea or unreachable areas.  
  This is handled with **up to 5 retry attempts** before an error is shown to the user.
- The number of available **destination images** is limited.  
  Some cities may not display an image.
---

## Project Folder Structure

```
final_project/
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│   └── .env                  # Client environment variables
│
├── server/                   # Node.js backend
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env                  # Server environment variables
│
└── README.md                 # Project documentation

```

---

## License

This project was developed as a final assignment for the **Web Full-Stack Development course (2025)**.  
It is intended for academic use only.