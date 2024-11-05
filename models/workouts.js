const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    routine: { type: Object, required: true }  // Store workout routine by day
});

module.exports = mongoose.model('Workout', workoutSchema);
