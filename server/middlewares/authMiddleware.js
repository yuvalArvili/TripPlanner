// Middleware to protect routes using JWT authentication
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.header('Authorization');

  // If no token is provided or it doesn't start with 'Bearer ', block access
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Remove "Bearer " prefix to extract the actual token
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save the decoded user payload to the request object
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    // If the token is invalid, deny access
    console.error('Invalid token:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;