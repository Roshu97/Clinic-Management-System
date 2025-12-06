import * as admin from 'firebase-admin';
import firebaseFunctionsTest from 'firebase-functions-test'; // Changed to default import
import { setCustomUserRole } from './setRole';

// Initialize firebase-functions-test
const test = firebaseFunctionsTest();

// Mock admin.initializeApp() - This line will be removed or modified
// admin.initializeApp = jest.fn(); // This line caused TS2540

describe('setCustomUserRole', () => {
  let wrapped: any;

  beforeAll(() => {
    // Mock admin.initializeApp before wrapping the function
    jest.spyOn(admin, 'initializeApp').mockReturnValue(undefined);
    // Wrap the function
    wrapped = test.wrap(setCustomUserRole);
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
    } as any);

    const result = await wrapped(data, context);

    expect(getUserByEmailMock).toHaveBeenCalledWith(email);
    expect(setCustomUserClaimsMock).toHaveBeenCalledWith('test-uid', { role });
    expect(result).toEqual({ message: `Success! ${email} now has the role ${role}.` });
  });
});