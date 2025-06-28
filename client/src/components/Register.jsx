import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Form.css'; 
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { login, token } = useAuth();
  const navigate = useNavigate(); // Redirect to home page after successful registration

  // if user is already logged in
  if (token) return <Navigate to="/" />;

    //Handle register from submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try { // Send registration request to backend
      const res = await axios.post('/api/auth/register', {
        email,
        password,
      });

      // If registration is successful, log in the use
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Register</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {confirmPassword && password !== confirmPassword && (
          <p className="error-message">Passwords do not match</p>
        )}

        <button type="submit">Register</button>
      </form>


      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register;