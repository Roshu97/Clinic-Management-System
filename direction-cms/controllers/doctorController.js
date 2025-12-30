// controllers/doctorController.js
const db = require('../config/db');

// 1. Get Waiting Patients
exports.getWaitingPatients = async (req, res) => {
    try {
        // JOIN query to get Patient details linked to the Visit
        const query = `
            SELECT v.id AS visitId, v.token_number AS token, p.name, p.age, p.history 
            FROM visits v
            JOIN patients p ON v.patient_id = p.id
            WHERE v.status = 'waiting' AND v.visit_date = CURRENT_DATE
            ORDER BY v.token_number ASC
        `;
        
        const [rows] = await db.query(query);
        res.json(rows); // Send the list as JSON

    } catch (error) {
        console.error("Error fetching queue:", error);
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
};

// 2. Submit Prescription
exports.submitPrescription = async (req, res) => {
    const { visitId, medicines, notes } = req.body;

    if (!visitId || !medicines) {
        return res.status(400).json({ error: "Medicine details required" });
    }

    try {
        // Step 1: Save Prescription
        await db.query(
            'INSERT INTO prescriptions (visit_id, medicines, notes) VALUES (?, ?, ?)',
            [visitId, medicines, notes]
        );

        // Step 2: Update Visit Status to 'completed' (removes them from queue)
        await db.query(
            'UPDATE visits SET status = ? WHERE id = ?',
            ['completed', visitId]
        );

        res.json({ message: 'Prescription saved and visit completed.' });

    } catch (error) {
        console.error("Error saving prescription:", error);
        res.status(500).json({ error: 'Failed to save prescription' });
    }
};