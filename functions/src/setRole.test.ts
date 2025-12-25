import * as admin from 'firebase-admin';

// Mock firebase-admin
jest.mock('firebase-admin', () => {
  const authMock = {
    getUserByEmail: jest.fn(),
    setCustomUserClaims: jest.fn(),
  };
  const auth = jest.fn(() => authMock);
  return {
    initializeApp: jest.fn(),
    apps: [],
    auth: auth,
  };
});

import { setCustomUserRole } from './setRole';

describe('setCustomUserRole', () => {
  let req: any;
  let res: any;
  let authMock: any;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      getHeader: jest.fn(),
      setHeader: jest.fn(),
    };
    
    authMock = (admin.auth() as any);
    authMock.getUserByEmail.mockReset();
    authMock.setCustomUserClaims.mockReset();
    
    // Default success mock for getUserByEmail
    authMock.getUserByEmail.mockResolvedValue({ uid: 'test-uid' });
    authMock.setCustomUserClaims.mockResolvedValue(undefined);
  });

  it('should return 400 if email/uid or role are missing', async () => {
    req.body = { email: 'test@example.com' }; // Missing role
    
    await setCustomUserRole(req as any, res as any);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Missing uid/email or role" }));
  });

  it('should return 400 for invalid role', async () => {
    req.body = { email: 'test@example.com', role: 'admin' };
    
    await setCustomUserRole(req as any, res as any);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Invalid role" }));
  });

  it('should successfully set custom user role using email', async () => {
    const email = 'test@example.com';
    const role = 'doctor';
    req.body = { email, role };

    await setCustomUserRole(req as any, res as any);

    expect(authMock.getUserByEmail).toHaveBeenCalledWith(email);
    expect(authMock.setCustomUserClaims).toHaveBeenCalledWith('test-uid', { role });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should successfully set custom user role using uid', async () => {
    const uid = 'test-uid-direct';
    const role = 'receptionist';
    req.body = { uid, role };

    await setCustomUserRole(req as any, res as any);

    expect(authMock.setCustomUserClaims).toHaveBeenCalledWith(uid, { role });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
