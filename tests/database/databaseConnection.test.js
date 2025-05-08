// NEW - Create this entire file
// filepath: c:\Users\ander\OneDrive\Dokumenter\GitHub\P2-Project\tests\database\databaseConnection.test.js
import { connectToDatabase, createDbConnection } from '../../server/database/databaseConnection.js';

// NEW - Mock the mysql module
jest.mock('mysql', () => {
  const mockConnection = {
    connect: jest.fn(callback => callback(null)),
    query: jest.fn((query, callback) => {
      // If the second parameter is a callback function
      if (typeof callback === 'function') {
        callback(null, { affectedRows: 1 });
      }
      // Return mockConnection for chaining
      return mockConnection;
    }),
    end: jest.fn(callback => callback && callback()),
    state: 'connected'
  };
  
  return {
    createConnection: jest.fn(() => mockConnection)
  };
});

// NEW - Mock the middleware_jwt.js module
jest.mock('../../server/middleware/middleware_jwt.js', () => ({
  authenticateJWT: jest.fn(() => Promise.resolve({ userId: 1 }))
}));

describe('Database Connection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createDbConnection returns a connection object', () => {
    const connection = createDbConnection();
    expect(connection).toBeDefined();
  });

  test('connectToDatabase establishes a database connection', async () => {
    await expect(connectToDatabase()).resolves.toBeDefined();
  });
});