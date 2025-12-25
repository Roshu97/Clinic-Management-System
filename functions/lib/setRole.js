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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomUserRole = void 0;
const admin = __importStar(require("firebase-admin"));
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.setCustomUserRole = (0, https_1.onRequest)((req, res) => {
    corsHandler(req, res, async () => {
        // Handle preflight request 
        if (req.method === "OPTIONS") {
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.status(204).send("");
            return;
        }
        try {
            const { email, uid, role } = req.body;
            // Support both email (current frontend) and uid (user's snippet)
            let targetUid = uid;
            if (!targetUid && email) {
                const user = await admin.auth().getUserByEmail(email);
                targetUid = user.uid;
            }
            if (!targetUid || !role) {
                res.status(400).json({ error: "Missing uid/email or role" });
                return;
            }
            const allowedRoles = ['doctor', 'receptionist'];
            if (!allowedRoles.includes(role)) {
                res.status(400).json({ error: "Invalid role" });
                return;
            }
            firebase_functions_1.logger.info(`Setting role ${role} for user ${targetUid}`);
            await admin.auth().setCustomUserClaims(targetUid, { role });
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json({ success: true, message: `Role ${role} assigned successfully` });
        }
        catch (error) {
            firebase_functions_1.logger.error('Failed to set custom user role', error);
            res.set("Access-Control-Allow-Origin", "*");
            res.status(500).json({ error: error.message || "internal" });
        }
    });
});
//# sourceMappingURL=setRole.js.map