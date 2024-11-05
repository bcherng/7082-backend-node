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

// Retrieve workout routine by day
app.get('/api/workout-routine-day', async (req, res) => {
    const userId = req.query.userId;
    const { day } = req.query;

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (!validDays.includes(day)) {
        return res.status(400).json({ message: 'Invalid day provided' });
    }

    try {
        const workout = await Workout.findOne({ userId });

        if (workout && workout.routine[day]) {
            res.json({ [day]: workout.routine[day] });
        } else {
            res.status(404).json({ message: 'No workout found for this day' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workout routine' });
    }
});

module.exports = app;
