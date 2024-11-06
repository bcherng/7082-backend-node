require('dotenv').config({path: "../.env"});
const express = require('express');
const mongoose = require('mongoose');
const Workout = require('../models/workouts');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Retrieve the full workout routine
app.get('/api/workout-routine', async (req, res) => {
    const userId = req.query.userId;
    try {
        const workout = await Workout.findOne({ userId });

        if (!workout) {
            return res.status(404).json({ message: 'No workout found for this user' });
        }

        res.json(workout.routine);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workout routine' });
    }
});


module.exports = app;
