// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, use bcrypt to hash this!
    role: { type: String, enum: ['doctor', 'receptionist', 'pharmacist', 'admin'], required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);