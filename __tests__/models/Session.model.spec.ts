/**
 * __Session Model Unit Tests
 * Acceptance case (scenario)
 * - Create valid sessions with all required fields
 * - Validate required field constraints
 * - Test field length constraints for userAgent and ipAddress
 * - Verify unique constraint on refreshToken
 * - Test default values for isValid field
 * - Validate session management operations
 * - Test data integrity across updates
 * - Verify business logic for session lifecycle
 * - Handle edge cases and error conditions
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import SessionModel, { ISession } from '../../src/Models/Session.model';

/**
 * __Session Model Unit Tests
 * Acceptance case (scenario)
 * - Create valid sessions with all required fields
 * - Validate required field constraints
 * - Test field length constraints for userAgent and ipAddress
 * - Verify unique constraint on refreshToken
 * - Test default values for isValid field
 * - Validate session management operations
 * - Test data integrity across updates
 * - Verify business logic for session lifecycle
 * - Handle edge cases and error conditions
 */
describe('Session Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await SessionModel.deleteMany({});
  });

  const validSessionData = {
    userId: '507f1f77bcf86cd799439011',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  const validSessionWithOptionalFields = {
    ...validSessionData,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.100',
  };

  /**
   * __Valid Session Creation
   * Acceptance case (scenario)
   * - Create sessions with required and optional fields
   * - Verify persistence and data integrity
   * - Ensure correct schema mapping
   * - Test minimal data requirements
   */
  describe('Valid Session Creation', () => {
    /**
     * __Create Session with Valid Data
     * Acceptance case (scenario)
     * - Create a session with all required fields
     * - Verify saved document contains valid values
     * - Ensure timestamps and default values are generated
     */
    it('should create a session with valid data', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      expect(savedSession._id).toBeDefined();
      expect(savedSession.userId).toBe(validSessionData.userId);
      expect(savedSession.refreshToken).toBe(validSessionData.refreshToken);
      expect(savedSession.expiresAt).toEqual(validSessionData.expiresAt);
      expect(savedSession.isValid).toBe(true);
      expect(savedSession.createdAt).toBeDefined();
      expect(savedSession.updatedAt).toBeDefined();
    });

    /**
     * __Create Session with Optional Fields
     * Acceptance case (scenario)
     * - Save a session with userAgent and ipAddress
     * - Verify optional fields are persisted correctly
     * - Ensure isValid defaults to true
     */
    it('should create a session with optional fields', async () => {
      const session = new SessionModel(validSessionWithOptionalFields);
      const savedSession = await session.save();

      expect(savedSession.userAgent).toBe(validSessionWithOptionalFields.userAgent);
      expect(savedSession.ipAddress).toBe(validSessionWithOptionalFields.ipAddress);
      expect(savedSession.isValid).toBe(true);
    });

    /**
     * __Create Session with Minimal Data
     * Acceptance case (scenario)
     * - Create session with only required fields
     * - Verify minimal data persistence
     * - Ensure default values are applied
     */
    it('should create a session with minimal data', async () => {
      const minimalSessionData = {
        userId: '507f1f77bcf86cd799439012',
        refreshToken: 'minimal_token_12345',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      };

      const session = new SessionModel(minimalSessionData);
      const savedSession = await session.save();

      expect(savedSession.userId).toBe(minimalSessionData.userId);
      expect(savedSession.refreshToken).toBe(minimalSessionData.refreshToken);
      expect(savedSession.expiresAt).toEqual(minimalSessionData.expiresAt);
      expect(savedSession.isValid).toBe(true);
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure session integrity by enforcing field requirements
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required userId Field
     * Acceptance case (scenario)
     * - Attempt to save session without userId
     * - Verify validation error is thrown
     * - Ensure user association requirement
     */
    it('should require userId field', async () => {
      const sessionData = { ...validSessionData, userId: undefined };

      const session = new SessionModel(sessionData);

      let error: any;
      try {
        await session.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
    });

    /**
     * __Validate Required refreshToken Field
     * Acceptance case (scenario)
     * - Attempt to save session without refreshToken
     * - Verify validation error is thrown
     * - Ensure authentication token requirement
     */
    it('should require refreshToken field', async () => {
      const sessionData = { ...validSessionData, refreshToken: undefined };

      const session = new SessionModel(sessionData);

      let error: any;
      try {
        await session.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.refreshToken).toBeDefined();
    });

    /**
     * __Validate Required expiresAt Field
     * Acceptance case (scenario)
     * - Attempt to save session without expiresAt
     * - Verify validation error is thrown
     * - Ensure expiration time requirement
     */
    it('should require expiresAt field', async () => {
      const sessionData = { ...validSessionData, expiresAt: undefined };

      const session = new SessionModel(sessionData);

      let error: any;
      try {
        await session.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.expiresAt).toBeDefined();
    });
  });

  /**
   * __Field Constraints
   * Acceptance case (scenario)
   * - Enforce maximum length constraints
   * - Test valid length boundaries
   * - Validate IP address formats
   * - Ensure data quality and storage efficiency
   */
  describe('Field Constraints', () => {
    /**
     * __UserAgent Maximum Length Constraint
     * Acceptance case (scenario)
     * - Attempt to save userAgent exceeding 500 characters
     * - Verify validation error is thrown
     * - Ensure reasonable userAgent string limits
     */
    it('should enforce userAgent maxlength constraint', async () => {
      const longUserAgent = 'A'.repeat(501);
      const sessionData = { ...validSessionData, userAgent: longUserAgent };
      const session = new SessionModel(sessionData);

      let error: any;
      try {
        await session.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userAgent).toBeDefined();
    });

    /**
     * __Accept Valid UserAgent Length
     * Acceptance case (scenario)
     * - Save session with realistic userAgent string
     * - Verify userAgent within valid length range
     * - Ensure proper browser identification storage
     */
    it('should accept valid userAgent length', async () => {
      const validUserAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const sessionData = { ...validSessionData, userAgent: validUserAgent };

      const session = new SessionModel(sessionData);
      const savedSession = await session.save();

      expect(savedSession.userAgent).toBe(validUserAgent);
    });

    /**
     * __IPAddress Maximum Length Constraint
     * Acceptance case (scenario)
     * - Attempt to save ipAddress exceeding 45 characters
     * - Verify validation error is thrown
     * - Ensure IPv6 address compatibility
     */
    it('should enforce ipAddress maxlength constraint', async () => {
      const longIpAddress = 'A'.repeat(46);
      const sessionData = { ...validSessionData, ipAddress: longIpAddress };

      const session = new SessionModel(sessionData);

      let error: any;
      try {
        await session.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.ipAddress).toBeDefined();
    });

    /**
     * __Accept Valid IP Addresses
     * Acceptance case (scenario)
     * - Test IPv4 and IPv6 address formats
     * - Verify both address types are accepted
     * - Ensure proper IP address storage
     */
    it('should accept valid IP addresses', async () => {
      const validIpAddresses = [
        '192.168.1.1',
        '10.0.0.1',
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        '::1',
      ];

      for (const ipAddress of validIpAddresses) {
        const sessionData = {
          ...validSessionData,
          userId: `test_user_ip_${ipAddress.replace(/[:.]/g, '_')}_${Date.now()}`,
          refreshToken: `token_ip_${ipAddress}_${Date.now()}`,
          ipAddress,
        };
        const session = new SessionModel(sessionData);
        const savedSession = await session.save();

        expect(savedSession.ipAddress).toBe(ipAddress);
      }
    });
  });

  /**
   * __Unique Constraint
   * Acceptance case (scenario)
   * - Enforce refreshToken uniqueness across all sessions
   * - Test duplicate token rejection
   * - Validate multi-session scenarios for same user
   * - Ensure authentication security
   */
  describe('Unique Constraint', () => {
    /**
     * __Enforce Unique RefreshToken Constraint
     * Acceptance case (scenario)
     * - Create two sessions with identical refreshToken
     * - Verify duplicate key error is thrown
     * - Ensure token uniqueness across system
     */
    it('should enforce unique refreshToken constraint', async () => {
      const session1 = new SessionModel(validSessionData);
      await session1.save();

      const session2 = new SessionModel({
        ...validSessionData,
        userId: '507f1f77bcf86cd799439012',
        refreshToken: validSessionData.refreshToken,
      });

      let error: any;
      try {
        await session2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });

    /**
     * __Allow Different RefreshTokens for Same User
     * Acceptance case (scenario)
     * - Create multiple sessions for one user
     * - Verify different tokens are accepted
     * - Ensure multi-device session support
     */
    it('should allow different refreshTokens for same user', async () => {
      const session1 = new SessionModel(validSessionData);
      await session1.save();

      const session2 = new SessionModel({
        ...validSessionData,
        refreshToken: 'different_token_12345',
      });
      const savedSession2 = await session2.save();

      expect(savedSession2.refreshToken).toBe('different_token_12345');
      expect(savedSession2.userId).toBe(validSessionData.userId);
    });

    /**
     * __Reject Same RefreshToken for Different Users
     * Acceptance case (scenario)
     * - Attempt to reuse refreshToken across users
     * - Verify duplicate key error is thrown
     * - Ensure token uniqueness is global
     */
    it('should allow same refreshToken for different users', async () => {
      const session1 = new SessionModel(validSessionData);
      await session1.save();

      const session2 = new SessionModel({
        ...validSessionData,
        userId: '507f1f77bcf86cd799439012',
        refreshToken: validSessionData.refreshToken,
      });

      let error: any;
      try {
        await session2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });
  });

  /**
   * __Default Values
   * Acceptance case (scenario)
   * - Test automatic default value assignment
   * - Verify default isValid status is set to true
   * - Validate automatic timestamp generation
   * - Ensure proper default behavior for new sessions
   */
  describe('Default Values', () => {
    /**
     * __Verify Default isValid Status
     * Acceptance case (scenario)
     * - Create session without explicit isValid value
     * - Verify default isValid is set to true
     * - Ensure new sessions are active by default
     */
    it('should set default isValid to true', async () => {
      const sessionData = { ...validSessionData, isValid: undefined };
      const session = new SessionModel(sessionData);
      const savedSession = await session.save();

      expect(savedSession.isValid).toBe(true);
    });

    /**
     * __Verify Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create session without explicit timestamps
     * - Verify createdAt and updatedAt are generated
     * - Ensure timestamp consistency on creation
     */
    it('should set timestamps', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      expect(savedSession.createdAt).toBeInstanceOf(Date);
      expect(savedSession.updatedAt).toBeInstanceOf(Date);
      expect(savedSession.createdAt.getTime()).toBe(savedSession.updatedAt.getTime());
    });

    /**
     * __Update Timestamp on Save
     * Acceptance case (scenario)
     * - Modify and resave existing session
     * - Verify updatedAt is refreshed
     * - Ensure createdAt remains unchanged
     */
    it('should update updatedAt on save', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();
      const originalUpdatedAt = savedSession.updatedAt.getTime();

      await new Promise((resolve) => setTimeout(resolve, 10));

      savedSession.isValid = false;
      await savedSession.save();

      expect(savedSession.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);
    });
  });

  /**
   * __Session Management
   * Acceptance case (scenario)
   * - Test session lifecycle operations
   * - Validate expiration handling
   * - Test session invalidation workflows
   * - Verify multi-session user scenarios
   */
  describe('Session Management', () => {
    /**
     * __Handle Expired Sessions
     * Acceptance case (scenario)
     * - Create session with past expiration date
     * - Verify expired session is persisted
     * - Ensure expiration detection logic
     */
    it('should handle expired sessions', async () => {
      const expiredSessionData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439013',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000),
      };
      const session = new SessionModel(expiredSessionData);
      const savedSession = await session.save();

      expect(savedSession.expiresAt.getTime()).toBeLessThan(Date.now());
    });

    /**
     * __Handle Active Sessions
     * Acceptance case (scenario)
     * - Create session with future expiration date
     * - Verify active session is persisted
     * - Ensure session validity period
     */
    it('should handle active sessions', async () => {
      const activeSessionData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439014',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      };
      const session = new SessionModel(activeSessionData);
      const savedSession = await session.save();

      expect(savedSession.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    /**
     * __Handle Session Invalidation
     * Acceptance case (scenario)
     * - Manually invalidate an active session
     * - Verify isValid flag is updated
     * - Ensure session logout workflow
     */
    it('should handle session invalidation', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      expect(savedSession.isValid).toBe(true);

      savedSession.isValid = false;
      const invalidatedSession = await savedSession.save();

      expect(invalidatedSession.isValid).toBe(false);
    });

    /**
     * __Handle Multiple Sessions for Same User
     * Acceptance case (scenario)
     * - Create multiple sessions for one user
     * - Verify all sessions are persisted independently
     * - Ensure multi-device authentication support
     */
    it('should handle multiple sessions for same user', async () => {
      const session1 = new SessionModel(validSessionData);
      await session1.save();

      const session2 = new SessionModel({
        ...validSessionData,
        refreshToken: 'second_token_12345',
      });
      const savedSession2 = await session2.save();

      expect(savedSession2.userId).toBe(validSessionData.userId);
      expect(savedSession2.refreshToken).toBe('second_token_12345');
      expect(savedSession2.isValid).toBe(true);
    });
  });

  /**
   * __Data Integrity
   * Acceptance case (scenario)
   * - Test data consistency across updates
   * - Validate refresh token updates
   * - Test expiration date modifications
   * - Ensure createdAt immutability
   */
  describe('Data Integrity', () => {
    /**
     * __Maintain Data Consistency Across Updates
     * Acceptance case (scenario)
     * - Update multiple session fields simultaneously
     * - Verify all changes are persisted
     * - Ensure createdAt remains unchanged
     */
    it('should maintain data consistency across updates', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      savedSession.userAgent = 'Updated User Agent';
      savedSession.ipAddress = '10.0.0.1';
      savedSession.isValid = false;

      const updatedSession = await savedSession.save();

      expect(updatedSession.userAgent).toBe('Updated User Agent');
      expect(updatedSession.ipAddress).toBe('10.0.0.1');
      expect(updatedSession.isValid).toBe(false);
      expect(updatedSession.createdAt.getTime()).toBe(savedSession.createdAt.getTime());
    });

    /**
     * __Handle Refresh Token Updates
     * Acceptance case (scenario)
     * - Update refreshToken on existing session
     * - Verify new token is persisted
     * - Ensure token rotation workflow
     */
    it('should handle refresh token updates', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      const newRefreshToken = 'new_refresh_token_12345';
      savedSession.refreshToken = newRefreshToken;

      const updatedSession = await savedSession.save();

      expect(updatedSession.refreshToken).toBe(newRefreshToken);
    });

    /**
     * __Handle Expiration Date Updates
     * Acceptance case (scenario)
     * - Extend session expiration date
     * - Verify new expiration is persisted
     * - Ensure session renewal workflow
     */
    it('should handle expiration date updates', async () => {
      const session = new SessionModel(validSessionData);
      const savedSession = await session.save();

      const newExpirationDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
      savedSession.expiresAt = newExpirationDate;
      const updatedSession = await savedSession.save();

      expect(updatedSession.expiresAt).toEqual(newExpirationDate);
    });
  });

  /**
   * __Business Logic
   * Acceptance case (scenario)
   * - Test session cleanup workflows
   * - Validate expiration logic implementation
   * - Handle long refresh tokens
   * - Ensure realistic session scenarios
   */
  describe('Business Logic', () => {
    /**
     * __Handle Session Cleanup Scenarios
     * Acceptance case (scenario)
     * - Create multiple sessions for different users
     * - Delete sessions for specific user
     * - Verify other user sessions remain intact
     */
    it('should handle session cleanup scenarios', async () => {
      const sessions: ISession[] = [];
      for (let i = 0; i < 3; i++) {
        const sessionData = {
          ...validSessionData,
          userId: `507f1f77bcf86cd79943901${i}`,
          refreshToken: `token_${i}_${Date.now()}`,
        };
        sessions.push(await new SessionModel(sessionData).save());
      }

      expect(sessions).toHaveLength(3);

      await SessionModel.deleteMany({ userId: '507f1f77bcf86cd799439010' });

      const remainingSessions = await SessionModel.find({ userId: '507f1f77bcf86cd799439010' });
      expect(remainingSessions).toHaveLength(0);

      const otherSessions = await SessionModel.find({ userId: '507f1f77bcf86cd799439011' });
      expect(otherSessions).toHaveLength(1);
    });

    /**
     * __Handle Session Expiration Logic
     * Acceptance case (scenario)
     * - Create expired session
     * - Detect expiration programmatically
     * - Invalidate expired session
     */
    it('should handle session expiration logic', async () => {
      const expiredSessionData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439015',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000),
      };
      const session = new SessionModel(expiredSessionData);
      const savedSession = await session.save();

      const isExpired = savedSession.expiresAt.getTime() < Date.now();
      expect(isExpired).toBe(true);

      savedSession.isValid = false;
      await savedSession.save();

      expect(savedSession.isValid).toBe(false);
    });

    /**
     * __Handle Long Refresh Tokens
     * Acceptance case (scenario)
     * - Create session with 200-character token
     * - Verify long token is persisted
     * - Ensure JWT and long token support
     */
    it('should handle long refresh tokens', async () => {
      const longRefreshToken = 'A'.repeat(200);
      const sessionData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439016',
        refreshToken: longRefreshToken,
      };

      const session = new SessionModel(sessionData);
      const savedSession = await session.save();

      expect(savedSession.refreshToken).toBe(longRefreshToken);
    });
  });

  /**
   * __Edge Cases
   * Acceptance case (scenario)
   * - Test empty and null optional fields
   * - Handle immediate expiration scenarios
   * - Test far future expiration dates
   * - Ensure boundary condition handling
   */
  describe('Edge Cases', () => {
    /**
     * __Handle Empty Optional Fields
     * Acceptance case (scenario)
     * - Save session with empty string optional fields
     * - Verify empty strings are persisted
     * - Ensure optional field flexibility
     */
    it('should handle empty optional fields', async () => {
      const sessionData = {
        ...validSessionData,
        userAgent: '',
        ipAddress: '',
      };

      const session = new SessionModel(sessionData);
      const savedSession = await session.save();

      expect(savedSession.userAgent).toBe('');
      expect(savedSession.ipAddress).toBe('');
    });

    /**
     * __Handle Null Optional Fields
     * Acceptance case (scenario)
     * - Save session with null optional fields
     * - Verify null values are persisted
     * - Ensure null handling for optional data
     */
    it('should handle null optional fields', async () => {
      const sessionData = {
        ...validSessionData,
        userAgent: null,
        ipAddress: null,
      };
      const session = new SessionModel(sessionData);
      const savedSession = await session.save();

      expect(savedSession.userAgent).toBeNull();
      expect(savedSession.ipAddress).toBeNull();
    });

    /**
     * __Handle Immediate Expiration Sessions
     * Acceptance case (scenario)
     * - Create session expiring in 1 second
     * - Verify near-immediate expiration is accepted
     * - Ensure short-lived session support
     */
    it('should handle sessions with immediate expiration', async () => {
      const immediateExpirationData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439017',
        expiresAt: new Date(Date.now() + 1000),
      };
      const session = new SessionModel(immediateExpirationData);
      const savedSession = await session.save();

      expect(savedSession.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    /**
     * __Handle Far Future Expiration Sessions
     * Acceptance case (scenario)
     * - Create session expiring in 1 year
     * - Verify long-term expiration is accepted
     * - Ensure extended session support
     */
    it('should handle sessions with far future expiration', async () => {
      const farFutureExpirationData = {
        ...validSessionData,
        userId: '507f1f77bcf86cd799439018',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
      const session = new SessionModel(farFutureExpirationData);
      const savedSession = await session.save();

      expect(savedSession.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
