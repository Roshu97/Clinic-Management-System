const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    unit: { type: String, default: 'tablet' } // tablet, syrup, etc.
});

module.exports = mongoose.model('Medicine', medicineSchema);