require('dotenv').config({path: "../.env"});
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/*
    OPTIONAL: add OAuth
*/
module.exports = async (req, res) => {

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        return res.status(200).end();
    }
    
    if (req.method === 'POST') {
        const { username, email, password} = req.body;

        // check if the usernam or email already exists in the database
        try {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });

            if (existingUser) {
                return res.status(400).json({message: 'Username or email already taken'})
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

            const newUser = await User.create({ username, email, password: hashedPassword });
            
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(400).json({ message: 'User already exists' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
