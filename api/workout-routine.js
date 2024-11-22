require('dotenv').config({path: "../.env"});
const mongoose = require('mongoose');
const Workout = require('../models/workouts');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/*
    TO-DO: verify user before allowing access
*/
module.exports = async (req, res) => {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'GET') {
        const username = req.query.username;
        const { day } = req.query;

        try {
            const workout = await Workout.findOne({ userId: username }); 

            if (!workout) {
                return res.status(404).json({ message: 'No workout found for this user' });
            }
            
            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            // If the day is invalid or missing, return the entire routine
            if (!validDays.includes(day)) {
                return res.json(workout.routine);
            }

            // Filter the routine to get only the specified day's workouts
            const dayRoutine = workout.routine.find(([routineDay]) => routineDay === day);

            // If a routine for the specified day is found, return it; otherwise, return an error message
            if (dayRoutine) {
                res.json({ day: dayRoutine[0], exercises: dayRoutine[1] });
            } else {
                res.status(404).json({ message: `No routine found for ${day}` });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving workout routine', error });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

