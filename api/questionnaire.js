require('dotenv').config({path: "../.env"});
const mongoose = require('mongoose');
const User = require('../models/users');
const Workout = require('../models/workouts')
const helpers = require('../utils/helpers');  

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/*
    TO-DO: verify user first before allowing access
*/
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await User.findByIdAndUpdate(username, { questionnaire });
            const userRequirements = req.body.questionnaire || null;
            const username = req.body.username;
        
            try {
                // Generate the workout routine using the helper function
                const workoutData = await helpers.formatWorkoutData(userRequirements);
        
                // Create a new workout document
                const workout = await Workout.findOneAndUpdate(
                    { username },                 // Search criteria: find by username
                    { routine: workoutData },      // Update: set the routine to the new workout data
                    { new: true, upsert: true }    // Options: return the updated document, insert if not found
                );
                res.json({ message: 'Workout routine updated and stored successfully.' });
            } catch (error) {
                console.error('Error generating workout routine:', error);
                res.status(500).json({ message: 'Error generating workout routine.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error submitting questionnaire' });
        } 
    } else if (req.method === 'GET') {
        const { username } = req.query; 
        if (!username) {
            return res.status(400).json({ message: 'username is required' });
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

