require('dotenv').config({path: "../.env"});
const express = require('express');
const mongoose = require('mongoose');
const Workout = require('../models/workouts');
const User = require('../models/users');
const helpers = require('../utils/helpers');  // Assuming helpers.formatWorkoutData() is your workout generation function

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Generate workout routine
app.post('/api/generate-routine', async (req, res) => {
    const userRequirements = req.body.questionnaire || null;
    const userId = req.body.userId;

    try {
        // Generate the workout routine using the helper function
        const workoutData = await helpers.formatWorkoutData(userRequirements);

        // Create a new workout document
        const workout = new Workout({ userId, routine: workoutData });

        // Save the workout routine to the database
        await workout.save();
        res.json({ message: 'Workout routine generated and stored successfully.' });
    } catch (error) {
        console.error('Error generating workout routine:', error);
        res.status(500).json({ message: 'Error generating workout routine.' });
    }
});

module.exports = app;
