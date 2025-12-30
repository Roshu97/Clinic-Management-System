const db = require('../config/db');

const searchPatient = async (req, res) => {
    const { query } = req.query; // e.g., ?query=John

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const sql = `
            SELECT p.name, p.age, p.contact, v.visit_date, pr.medicines, pr.notes
            FROM patients p
            JOIN visits v ON p.id = v.patient_id
            LEFT JOIN prescriptions pr ON v.id = pr.visit_id
            WHERE p.name LIKE ? OR p.contact LIKE ?
            ORDER BY v.visit_date DESC
        `;
        const searchTerm = `%${query}%`;
        const [rows] = await db.query(sql, [searchTerm, searchTerm]);
        
        res.json(rows);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Search failed" });
    }
};

module.exports = { searchPatient };