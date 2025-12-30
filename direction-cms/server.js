require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes'); 
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
// Use the Environment Variable for Render, fallback to local for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_cms';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---
app.use('/api', apiRoutes);

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ 
                message: 'Success', 
                user: { role: user.role, name: user.name } 
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        // Log the actual error to Render logs so you can see it
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// // --- FRONTEND SERVING ---
// // This path is crucial for Render deployment
// // 1. Correct the path logic to go UP one level properly
// const frontendPath = path.resolve(__dirname, '..', 'direction-frontend');

// // 2. Add a simple log to verify the path in Render logs
// console.log("Serving frontend from:", frontendPath);

// // 3. Static files MUST be served BEFORE the catch-all route
// app.use(express.static(frontendPath));

// // 4. API Routes
// app.use('/api', apiRoutes);

// // 5. The catch-all route (Express 5 compatible)
// // Use /*splat instead of just *
// app.get('/*splat', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'login.html'));
// });

/* ---------- FRONTEND ---------- */
const frontendPath = path.join(__dirname, 'direction-frontend');
console.log('Serving frontend from:', frontendPath);

app.use(express.static(frontendPath));

/* ---------- API ---------- */
app.use('/api', apiRoutes);

/* ---------- CATCH-ALL ---------- */
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});


// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));