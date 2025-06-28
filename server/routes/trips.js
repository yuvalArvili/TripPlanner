const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/trips – Save a new trip
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Destructure all expected fields from the request body
    const {
      name,
      description,
      type,
      coordinates,
      day1 = [],
      day2 = []
    } = req.body;

    // Validate required fields
    if (!name || !type || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new Trip document
    const trip = new Trip({
      userId: req.user.userId,
      name,
      description,
      type,
      coordinates,
      day1,
      day2
    });

    await trip.save();
    res.status(201).json({ message: 'Trip saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/trips – Get all trips for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const trips = await Trip.find({ userId }).select('name description createdAt');
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// GET /api/trips/:id – Get a specific trip by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tripId = req.params.id;

    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading trip' });
  }
});

module.exports = router;