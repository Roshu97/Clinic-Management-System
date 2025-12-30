
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    visitId: { type: String, required: true },
    token_number: Number,
    name: String,
    age: Number,
    contact: String,
    history: String,
    status: { type: String, default: 'waiting' }, 
    medicines: String,
    notes: String,
    paymentStatus: { type: String, default: 'pending' },
    billAmount: Number,
    visitDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);