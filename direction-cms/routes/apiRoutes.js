// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); // Import the Model we just created

// --- SEARCH ROUTE ---
// GET /api/patient/search?keyword=John
router.get('/patient/search', async (req, res) => {
    const keyword = req.query.keyword;
    try {
        const results = await Patient.find({ 
            name: { $regex: keyword, $options: 'i' } // 'i' = case-insensitive
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// --- RECEPTIONIST: ADD PATIENT ---
// POST /api/patient/add
router.post('/patient/add', async (req, res) => {
    try {
        const count = await Patient.countDocuments({}); 
        
        const newPatient = new Patient({
            visitId: Date.now().toString(),
            token_number: count + 1,
            name: req.body.name,
            age: req.body.age,
            contact: req.body.contact,
            history: req.body.history
        });

        await newPatient.save();
        
        res.json({ 
            message: 'Added', 
            token: newPatient.token_number, 
            patientName: newPatient.name 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add patient' });
    }
});

// --- DOCTOR: QUEUE ---
// GET /api/doctor/queue
router.get('/doctor/queue', async (req, res) => {
    try {
        const queue = await Patient.find({ status: 'waiting' });
        res.json(queue);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
});

// --- DOCTOR: PRESCRIBE ---
// POST /api/doctor/prescribe
router.post('/doctor/prescribe', async (req, res) => {
    const { visitId, medicines, notes } = req.body;

    try {
        const patient = await Patient.findOne({ visitId });

        if (patient) {
            patient.status = 'treated';
            patient.medicines = medicines;
            patient.notes = notes;
            await patient.save(); 
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Prescription failed' });
    }
});

// --- BILLING: PENDING ---
// GET /api/billing/pending
router.get('/billing/pending', async (req, res) => {
    try {
        const pending = await Patient.find({ 
            status: 'treated', 
            paymentStatus: 'pending' 
        });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
});

// --- BILLING: CREATE ---
// POST /api/billing/create
router.post('/billing/create', async (req, res) => {
    const { visitId, amount } = req.body;

    try {
        const patient = await Patient.findOne({ visitId });

        if (patient) {
            patient.paymentStatus = 'paid';
            patient.billAmount = amount;
            await patient.save();
            res.json({ message: 'Payment successful' });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Billing failed' });
    }
});

const Medicine = require('../models/Medicine');

// 1. Get all prescriptions ready for pharmacy
router.get('/pharmacy/pending', async (req, res) => {
    try {
        // Find treated patients whose medicine hasn't been dispensed yet
        const pending = await Patient.find({ status: 'treated', paymentStatus: 'paid' });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pharmacy queue' });
    }
});

// 2. Get Inventory
router.get('/pharmacy/inventory', async (req, res) => {
    const stock = await Medicine.find();
    res.json(stock);
});

// 3. Update Stock (Add new medicine)
router.post('/pharmacy/inventory/add', async (req, res) => {
    const { name, stock, price } = req.body;
    const item = new Medicine({ name, stock, price });
    await item.save();
    res.json({ message: 'Medicine added to stock' });
});

// --- PHARMACY: DISPENSE & STOCK UPDATE ---
router.post('/pharmacy/dispense', async (req, res) => {
    const { visitId, medicines } = req.body;
    try {
        const patient = await Patient.findOne({ visitId });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const medNames = medicines.split(/,|\n/);
        for (let name of medNames) {
            const cleanName = name.trim().split(' ')[0]; 
            await Medicine.findOneAndUpdate(
                { name: { $regex: cleanName, $options: 'i' }, stock: { $gt: 0 } },
                { $inc: { stock: -1 } }
            );
        }
        patient.status = 'completed';
        await patient.save();
        res.json({ message: 'Medication dispensed and stock updated' });
    } catch (err) {
        res.status(500).json({ error: 'Dispensing failed' });
    }
});

// --- ADMIN: DAILY REPORT ---
router.get('/admin/daily-report', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const paidPatients = await Patient.find({
            paymentStatus: 'paid',
            visitDate: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalEarnings = paidPatients.reduce((sum, p) => sum + (p.billAmount || 0), 0);
        res.json({
            date: new Date().toLocaleDateString(),
            totalEarnings,
            patientCount: paidPatients.length,
            patients: paidPatients.map(p => ({ name: p.name, amount: p.billAmount }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// routes/apiRoutes.js

// POST /api/pharmacy/inventory/update
router.post('/pharmacy/inventory/update', async (req, res) => {
    const { medId, change } = req.body;
    try {
        const item = await Medicine.findByIdAndUpdate(
            medId, 
            { $inc: { stock: change } }, 
            { new: true }
        );
        res.json({ message: 'Stock updated', newItem: item });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

const User = require('../models/User');

// 1. Add a new user
router.post('/admin/users/add', async (req, res) => {
    try {
        const { username, password, role, name } = req.body;
        const newUser = new User({ username, password, role, name });
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Username already exists or data invalid' });
    }
});

// 2. Get all users
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Send everything EXCEPT the password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


// DELETE /api/admin/users/:id
router.delete('/admin/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user first to check their role (Optional safety)
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// routes/apiRoutes.js

router.get('/admin/revenue-stats', async (req, res) => {
    try {
        const stats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));

            const paidPatients = await Patient.find({
                paymentStatus: 'paid',
                visitDate: { $gte: start, $lte: end }
            });

            const dailyTotal = paidPatients.reduce((sum, p) => sum + (p.billAmount || 0), 0);
            
            stats.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: dailyTotal
            });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch revenue stats' });
    }
});


module.exports = router;