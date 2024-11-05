require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/users');
const Workout = require('./models/workouts');
const helpers = require ('./utils/helpers')

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware for verifying JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'User already exists' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Submit questionnaire
app.post('/questionnaire', authenticateToken, async (req, res) => {
    const { questionnaire } = req.body;

    try {
        await User.findByIdAndUpdate(req.user.id, { questionnaire });
        res.json({ message: 'Questionnaire submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting questionnaire' });
    }
});

// Generate workout routine (based on the questionnaire)
app.post('/generate-routine', authenticateToken, async (req, res) => {
    // Get user requirements from the request body
    const userRequirements = req.body.questionnaire || null;

    try {
        // Generate the workout routine using the helper function
        const workoutData = await helpers.formatWorkoutData(userRequirements);

        // Create a new workout document
        const workout = new Workout({ userId: req.user.id, routine: workoutData });

        // Save the workout routine to the database
        await workout.save();
        res.json({ message: 'Workout routine generated and stored successfully.' });
    } catch (error) {
        console.error('Error generating workout routine:', error);
        res.status(500).json({ message: 'Error generating workout routine.' });
    }
});


// Retrieve the full workout routine
app.get('/workout-routine', authenticateToken, async (req, res) => {
    try {
        const workout = await Workout.findOne({ userId: req.user.id });

        if (!workout) {
            return res.status(404).json({ message: 'No workout found for this user' });
        }

        res.json(workout.routine);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workout routine' });
    }
});

// Retrieve workout routine by day
app.get('/workout-routine/:day', authenticateToken, async (req, res) => {
    const { day } = req.params;
    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (!validDays.includes(day)) {
        return res.status(400).json({ message: 'Invalid day provided' });
    }

    try {
        const workout = await Workout.findOne({ userId: req.user.id });

        if (workout && workout.routine[day]) {
            res.json({ [day]: workout.routine[day] });
        } else {
            res.status(404).json({ message: 'No workout found for this day' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workout routine' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
