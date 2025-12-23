import logger from '../logger.js';

describe('logger', () => {
  let consoleSpy;

  beforeEach(() => {
    // Mock console methods to prevent actual logging during tests
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    // Restore original console methods after each test
    jest.restoreAllMocks();
  });

  test('info method should call console.log with INFO prefix and timestamp', () => {
    const message = 'This is an info message';
    logger.info(message);
    expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringMatching(/\[INFO\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z: This is an info message/));
  });

  test('warn method should call console.warn with WARN prefix and timestamp', () => {
    const message = 'This is a warning message';
    logger.warn(message);
    expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringMatching(/\[WARN\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z: This is a warning message/));
  });

  test('error method should call console.error with ERROR prefix and timestamp', () => {
    const message = 'This is an error message';
    logger.error(message);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringMatching(/\[ERROR\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z: This is an error message/));
  });

  test('info method should pass additional arguments to console.log', () => {
    const message = 'Info with data';
    const data = { key: 'value' };
    logger.info(message, data);
    expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining(message), data);
  });

  test('warn method should pass additional arguments to console.warn', () => {
    const message = 'Warn with data';
    const error = new Error('Something went wrong');
    logger.warn(message, error);
    expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringContaining(message), error);
  });

  test('error method should pass additional arguments to console.error', () => {
    const message = 'Error with data';
    const error = { code: 500, details: 'Internal Server Error' };
    logger.error(message, error);
    expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining(message), error);
  });
});