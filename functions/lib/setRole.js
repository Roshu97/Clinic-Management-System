"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomUserRole = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.setCustomUserRole = functions.https.onRequest(async (req, res) => {
    // Manual CORS handling
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    functions.logger.info(`Received request: ${req.method}`, { body: req.body });
    try {
        const { email, uid, role } = req.body;
        if (!role) {
            functions.logger.error("Missing role in request body");
            res.status(400).json({ error: "Missing role" });
            return;
        }
        // Support both email (current frontend) and uid (user's snippet)
        let targetUid = uid;
        if (!targetUid && email) {
            try {
                const user = await admin.auth().getUserByEmail(email);
                targetUid = user.uid;
            }
            catch (authError) {
                functions.logger.error(`User not found for email: ${email}`, authError);
                res.status(404).json({ error: `User with email ${email} not found` });
                return;
            }
        }
        if (!targetUid) {
            functions.logger.error("Missing uid or email in request body");
            res.status(400).json({ error: "Missing uid or email" });
            return;
        }
        const allowedRoles = ['doctor', 'receptionist'];
        if (!allowedRoles.includes(role)) {
            functions.logger.error(`Invalid role: ${role}`);
            res.status(400).json({ error: "Invalid role" });
            return;
        }
        functions.logger.info(`Setting role ${role} for user ${targetUid}`);
        await admin.auth().setCustomUserClaims(targetUid, { role });
        res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
    }
    catch (error) {
        functions.logger.error('Failed to set custom user role', error);
        res.status(500).json({ error: error.message || "internal server error" });
    }
});
//# sourceMappingURL=setRole.js.map