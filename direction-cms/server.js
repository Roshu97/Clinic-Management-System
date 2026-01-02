require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes'); 
const User = require('./models/User'); // Only one declaration here

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_cms';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        createAdmin(); // Seed admin after successful connection
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---
app.use('/api', apiRoutes);

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }); // Find by username only first

        if (user && await user.comparePassword(password)) {
            // Success!
            res.json({ 
                message: 'Success', 
                user: { role: user.role, name: user.name } 
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- FRONTEND SERVING ---
const frontendPath = path.resolve(__dirname, '..', 'direction-frontend');
console.log("✅ Serving frontend from:", frontendPath);

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// Express 5 compatible named wildcard
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// --- SEED FUNCTION ---
async function createAdmin() {
    try {
        const existing = await User.findOne({ username: 'boss' });
        if (existing) await User.deleteOne({ username: 'boss' });

        // The .pre('save') hook in our model will automatically hash '123'
        const admin = new User({
            username: 'boss',
            password: '123', 
            role: 'admin',
            name: 'System Admin'
        });
        await admin.save();
        console.log("✅ Secure Admin 'boss' created!");
    } catch (err) {
        console.error("Seed error:", err);
    }
}

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));