const db = require('../config/db');

// 1. Get List of Patients Pending Billing
exports.getPendingBills = async (req, res) => {
    try {
        // Select visits where status is 'completed' BUT not yet present in 'bills' table
        const query = `
            SELECT v.id AS visitId, v.token_number, p.name 
            FROM visits v
            JOIN patients p ON v.patient_id = p.id
            WHERE v.status = 'completed' 
            AND v.id NOT IN (SELECT visit_id FROM bills)
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching pending bills:", error);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. Create a Bill
exports.createBill = async (req, res) => {
    const { visitId, amount } = req.body;

    if (!visitId || !amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    try {
        // Insert into bills table
        await db.query(
            'INSERT INTO bills (visit_id, amount, generated_by) VALUES (?, ?, ?)',
            [visitId, amount, 1] // Hardcoded '1' assuming Receptionist ID 1 is logged in
        );

        res.json({ message: "Bill Generated Successfully" });
    } catch (error) {
        console.error("Error creating bill:", error);
        res.status(500).json({ error: "Failed to generate bill" });
    }
};