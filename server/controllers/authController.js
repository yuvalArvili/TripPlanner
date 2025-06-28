const User = require('../models/User'); // User model (from database)
const bcrypt = require('bcrypt');       // For hashing passwords
const jwt = require('jsonwebtoken');    // For creating login tokens

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Compare entered password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create a JWT token that identifies the user
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token is valid for 1 day
    );

    // Send the token to the client
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};