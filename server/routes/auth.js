const express = require('express');
// Create a new router instance
const router = express.Router();

// Import register and login functions from the auth controller
const { register, login } = require('../controllers/authController');

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Export the router to be used in server.js
module.exports = router;