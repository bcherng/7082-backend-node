require('dotenv').config({ path: "../.env" });
const mongoose = require('mongoose');
const User = require('../models/users');
const Workout = require('../models/workouts');
const helpers = require('../utils/helpers');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const username = req.body.username;
        const questionnaire = req.body.questionnaire || null;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        try {
            // Update the user's questionnaire
            await User.findOneAndUpdate({ username }, { questionnaire });

            // Generate the workout routine using the helper function
            const workoutData = await helpers.formatWorkoutData(questionnaire);

            // Create or update the workout document
            const workout = await Workout.findOneAndUpdate(
                { username },
                { routine: workoutData },
                { new: true, upsert: true }
            );

            res.json({ message: 'Workout routine updated and stored successfully.', workout });
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).json({ message: 'Error processing request.', error });
        }
    } else if (req.method === 'GET') {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        try {
            const user = await User.findOne({ username });
            if (user) {
                res.status(200).json({ questionnaire: user.questionnaire });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving questionnaire', error });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
