import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import HistoryPage from './components/HistoryPage';
import PlanRoute from './routes/PlanRoute';
import TripDetails from './components/TripDetails';
import Home from './components/Home';

// Main application content that includes routing and conditional rendering of the Navbar
// This component checks the current path and decides whether to show the Navbar or not
function AppContent() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const hiddenPaths = ['/login', '/register'];
    setShowNavbar(!hiddenPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/planRoute" element={<ProtectedRoute><PlanRoute /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/trip/:id" element={<TripDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;