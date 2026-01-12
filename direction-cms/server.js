require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken'); // All requires at the top
const apiRoutes = require('./routes/apiRoutes'); 
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_cms';

console.log('⏳ Connecting to MongoDB...');
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        createAdmin(); 
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SECURITY MIDDLEWARE (The Gatekeeper) ---
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Stores user ID and Role for use in routes
        next(); 
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

// --- AUTHENTICATION ROUTE ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && await user.comparePassword(password)) {
            // Generate the secure token
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            res.json({ 
                message: 'Success', 
                token: token, 
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

// --- API ROUTES ---
// You can now protect the entire apiRoutes folder like this:
app.use('/api', protect, apiRoutes); 

// --- FRONTEND SERVING ---
const frontendPath = path.resolve(__dirname, '..', 'direction-frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// --- SEED FUNCTION ---
async function createAdmin() {
    try {
        const existing = await User.findOne({ username: 'boss' });
        if (existing) await User.deleteOne({ username: 'boss' });

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