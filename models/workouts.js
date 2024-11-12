const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    username: { type: String, ref: 'User' },
    routine: { type: Object, required: true, unique: true }  
});

module.exports = mongoose.model('Workout', workoutSchema);
