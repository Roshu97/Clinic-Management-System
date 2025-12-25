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
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
admin.initializeApp();
exports.setCustomUserRole = (0, https_1.onCall)({
    cors: "*"
}, async (request) => {
    // Check if the request is made by an authenticated user
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Only authenticated users can set custom claims.');
    }
    const { email, role } = request.data;
    if (!email || !role) {
        throw new https_1.HttpsError('invalid-argument', 'The function must be called with an email and a role.');
    }
    const allowedRoles = ['doctor', 'receptionist'];
    if (!allowedRoles.includes(role)) {
        throw new https_1.HttpsError('invalid-argument', 'The role must be either doctor or receptionist.');
    }
    try {
        firebase_functions_1.logger.info(`Setting role ${role} for user ${email}`);
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role: role });
        return { message: `Success! ${email} now has the role ${role}.` };
    }
    catch (error) {
        firebase_functions_1.logger.error('Failed to set custom user role', error);
        // Check if it's a known auth error
        if (error.code === 'auth/user-not-found') {
            throw new https_1.HttpsError('not-found', `User with email ${email} not found.`);
        }
        throw new https_1.HttpsError('internal', error.message || 'Failed to set custom user role.');
    }
});
//# sourceMappingURL=setRole.js.map