require('dotenv').config({path: "../.env"});
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Submit questionnaire
app.post('/api/questionnaire', async (req, res) => {
    const { questionnaire, userId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { questionnaire });
        res.json({ message: 'Questionnaire submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting questionnaire' });
    }
});

module.exports = app;
