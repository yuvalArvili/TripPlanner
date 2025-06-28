import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';


function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">Trip Planner</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/planRoute">Plan Trip</Link>
            <Link to="/history">History</Link>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;