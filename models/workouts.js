const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    routine: { type: Object, required: true }  
});

module.exports = mongoose.model('Workout', workoutSchema);
