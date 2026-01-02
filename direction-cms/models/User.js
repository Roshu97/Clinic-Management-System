const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'receptionist', 'pharmacist'], required: true },
    name: { type: String, required: true }
});

// FIXED: Removed 'next' and used standard async flow
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        throw new Error('Password hashing failed');
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);