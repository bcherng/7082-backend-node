require('dotenv').config({path: "../.env"});
const mongoose = require('mongoose');
const User = require('../models/users');

// Connect to MongoDB
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { questionnaire, userId } = req.body;
            try {
                await User.findByIdAndUpdate(userId, { questionnaire });
                res.json({ message: 'Questionnaire submitted successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error submitting questionnaire' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error submitting questionnaire', error });
        }
    } else if (req.method === 'GET') {
        const { userId } = req.query; 
        try {
            const user = await User.findById(userId);
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