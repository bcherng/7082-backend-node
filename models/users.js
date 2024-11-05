const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    questionnaire: { type: Object } // Store questionnaire responses here
});

module.exports = mongoose.model('User', userSchema);
