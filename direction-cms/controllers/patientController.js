// controllers/patientController.js
const db = require('../config/db');

exports.createPatientAndToken = async (req, res) => {
    const { name, age, contact, history } = req.body;

    // Basic Validation
    if (!name || !age) {
        return res.status(400).json({ error: "Name and Age are required" });
    }

    try {
        // Step 1: Insert Patient Data
        const [patientResult] = await db.query(
            'INSERT INTO patients (name, age, contact, history) VALUES (?, ?, ?, ?)',
            [name, age, contact, history]
        );
        const patientId = patientResult.insertId;

        // Step 2: Calculate Token (Count today's visits + 1)
        const [countResult] = await db.query(
            'SELECT COUNT(*) as count FROM visits WHERE visit_date = CURRENT_DATE'
        );
        const tokenNumber = countResult[0].count + 1;

        // Step 3: Create Visit Record
        await db.query(
            'INSERT INTO visits (patient_id, token_number, status) VALUES (?, ?, ?)',
            [patientId, tokenNumber, 'waiting']
        );

        // Send success response
        res.status(201).json({ 
            message: 'Patient registered successfully', 
            token: tokenNumber,
            patientName: name 
        });

    } catch (error) {
        console.error("Error in createPatientAndToken:", error);
        res.status(500).json({ error: 'Database error occurred' });
    }
};

exports.searchPatient = async (req, res) => {
        const { query } = req.query; // e.g., ?query=John
        try {
            const [rows] = await db.query(`
                SELECT p.name, p.contact, v.visit_date, pr.medicines, pr.notes 
                FROM patients p
                JOIN visits v ON p.id = v.patient_id
                LEFT JOIN prescriptions pr ON v.id = pr.visit_id
                WHERE p.name LIKE ? OR p.contact LIKE ?
            `, [`%${query}%`, `%${query}%`]);
            
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
    
exports.searchPatientHistory = async (req, res) => {
    const { keyword } = req.query; // e.g., ?keyword=John

    try {
        const query = `
            SELECT p.name, p.age, v.visit_date, pr.medicines, pr.notes
            FROM patients p
            JOIN visits v ON p.id = v.patient_id
            LEFT JOIN prescriptions pr ON v.id = pr.visit_id
            WHERE p.name LIKE ? OR p.contact LIKE ?
            ORDER BY v.visit_date DESC
        `;
        const searchTerm = `%${keyword}%`;
        const [rows] = await db.query(query, [searchTerm, searchTerm]);
        
        res.json(rows);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Search failed" });
    }
};