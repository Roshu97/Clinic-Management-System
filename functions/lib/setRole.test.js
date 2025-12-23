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
const admin = __importStar(require("firebase-admin"));
const firebase_functions_test_1 = __importDefault(require("firebase-functions-test")); // Changed to default import
const setRole_1 = require("./setRole");
// Initialize firebase-functions-test
const test = (0, firebase_functions_test_1.default)();
// Mock admin.initializeApp() - This line will be removed or modified
// admin.initializeApp = jest.fn(); // This line caused TS2540
describe('setCustomUserRole', () => {
    let wrapped;
    beforeAll(() => {
        // Mock admin.initializeApp before wrapping the function
        jest.spyOn(admin, 'initializeApp').mockReturnValue(undefined);
        // Wrap the function
        wrapped = test.wrap(setRole_1.setCustomUserRole);
    });
    afterAll(() => {
        test.cleanup();
        jest.restoreAllMocks(); // Restore mocks after all tests
    });
    it('should throw unauthenticated error if called by unauthenticated user', async () => {
        const data = { email: 'test@example.com', role: 'doctor' };
        const context = {}; // Unauthenticated context
        await expect(wrapped(data, context)).rejects.toThrow('Only authenticated users can set custom claims.');
    });
    it('should throw invalid-argument error if email or role are missing', async () => {
        const context = { auth: { uid: 'some-uid', token: {} } };
        // Missing email
        const dataWithoutEmail = { role: 'doctor' };
        await expect(wrapped(dataWithoutEmail, context)).rejects.toThrow('The function must be called with an email and a role.');
        // Missing role
        const dataWithoutRole = { email: 'test@example.com' };
        await expect(wrapped(dataWithoutRole, context)).rejects.toThrow('The function must be called with an email and a role.');
    });
    it('should reject unsupported role values', async () => {
        const email = 'test@example.com';
        const data = { email, role: 'admin' };
        const context = { auth: { uid: 'some-uid', token: {} } };
        await expect(wrapped(data, context)).rejects.toThrow('The role must be either doctor or receptionist.');
    });
    it('should successfully set custom user role for an authenticated user', async () => {
        const email = 'test@example.com';
        const role = 'doctor';
        const data = { email, role };
        const context = { auth: { uid: 'some-uid', token: {} } };
        // Mock admin.auth().getUserByEmail and admin.auth().setCustomUserClaims
        const getUserByEmailMock = jest.fn(() => Promise.resolve({ uid: 'test-uid' }));
        const setCustomUserClaimsMock = jest.fn(() => Promise.resolve());
        jest.spyOn(admin, 'auth').mockReturnValue({
            getUserByEmail: getUserByEmailMock,
            setCustomUserClaims: setCustomUserClaimsMock,
        });
        const result = await wrapped(data, context);
        expect(getUserByEmailMock).toHaveBeenCalledWith(email);
        expect(setCustomUserClaimsMock).toHaveBeenCalledWith('test-uid', { role });
        expect(result).toEqual({ message: `Success! ${email} now has the role ${role}.` });
    });
});
//# sourceMappingURL=setRole.test.js.map