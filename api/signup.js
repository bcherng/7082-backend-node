require('dotenv').config({path: "../.env"});
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
    if (req.method === 'POST') {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hash(password, process.env.SALT_ROUNDS);

        try {
            const newUser = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(400).json({ message: 'User already exists' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
