require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes'); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/clinic_cms')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/api', apiRoutes);

const USERS = [
    { id: 1, username: 'dr_smith', password: '123', role: 'doctor', name: 'Dr. Smith' },
    { id: 2, username: 'admin',    password: '123', role: 'receptionist', name: 'Front Desk' },
    { id: 3, username: 'pharmacy', password: '123', role: 'pharmacist', name: 'Main Pharmacy' },
    { id: 4, username: 'boss',     password: '123', role: 'admin', name: 'Clinic Manager' }
];

const User = require('./models/User');

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
        res.status(500).json({ error: 'Server error during login' });
    }
});

const frontendPath = path.join(__dirname, '../direction-frontend'); 
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const MONGO_URI = process.env.MONGO_URI; // We will set this in Render


mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error(err));