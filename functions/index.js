const functions = require("firebase-functions"); 
const admin = require("firebase-admin"); 
const cors = require("cors"); 
 
admin.initializeApp(); 
 
const corsHandler = cors({ 
   origin: [ 
     "https://clinic-management-system-1-alde.onrender.com" 
   ], 
   methods: ["POST", "OPTIONS"], 
   allowedHeaders: ["Content-Type", "Authorization"] 
}); 
 
exports.setCustomUserRole = functions 
   .region("asia-southeast1") 
   .https.onRequest((req, res) => { 
     corsHandler(req, res, async () => { 
 
       // ✅ Handle preflight request 
       if (req.method === "OPTIONS") { 
         return res.status(204).send(""); 
       } 
 
       try { 
         const { uid, role } = req.body; 
 
         if (!uid || !role) { 
           return res.status(400).json({ error: "Missing uid or role" }); 
         } 
 
         await admin.auth().setCustomUserClaims(uid, { role }); 
 
         return res.status(200).json({ 
           success: true, 
           message: "Custom role set successfully" 
         }); 
 
       } catch (error) { 
         console.error("Error setting role:", error); 
         return res.status(500).json({ error: error.message }); 
       } 
     }); 
   }); 
