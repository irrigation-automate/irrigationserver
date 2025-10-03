/**
 * __User Model Unit Tests
 * Acceptance case (scenario)
 * - Create users with valid reference data
 * - Validate required field constraints for contact, address, and password
 * - Test default values for blocked status and creation date
 * - Verify JWT token generation functionality
 * - Test user document updates
 * - Handle missing JWT secret scenarios
 * - Ensure data integrity and persistence
 * - Validate reference relationships to related models
 */

const mockJWTSecret = 'test-secret-key';
jest.mock('../../src/configs/envirementVariables', () => ({
  enirementVariables: {
    JWTConfig: {
      JWTSecret: mockJWTSecret,
    },
  },
}));

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../../src/Models/user/User.model';
jest.mock('../../src/Models/user/user.contact');
jest.mock('../../src/Models/user/User.adress');
jest.mock('../../src/Models/user/user.password');

/**
 * __User Model Unit Tests
 * Acceptance case (scenario)
 * - Create users with valid reference data
 * - Validate required field constraints for contact, address, and password
 * - Test default values for blocked status and creation date
 * - Verify JWT token generation functionality
 * - Test user document updates
 * - Handle missing JWT secret scenarios
 * - Ensure data integrity and persistence
 * - Validate reference relationships to related models
 */
describe('User Model', () => {
  let mongoServer: MongoMemoryServer;

  let validUser: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const contactId = new mongoose.Types.ObjectId();
    const addressId = new mongoose.Types.ObjectId();
    const passwordId = new mongoose.Types.ObjectId();

    validUser = {
      contact: contactId,
      address: addressId,
      password: passwordId,
      blocked: false,
    };
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  /**
   * __Valid User Creation
   * Acceptance case (scenario)
   * - Create user with all required reference fields
   * - Verify saved document contains valid ObjectId references
   * - Ensure timestamps and default values are generated
   * - Validate optional fields remain undefined
   */
  it('should create and save a user successfully', async () => {
    const user = new User(validUser);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.contact?.toString()).toBe(validUser.contact?.toString());
    expect(savedUser.address?.toString()).toBe(validUser.address?.toString());
    expect(savedUser.password?.toString()).toBe(validUser.password?.toString());
    expect(savedUser.blocked).toBe(false);
    expect(savedUser.creation_date).toBeDefined();
    expect(savedUser.weather).toBeUndefined();
    expect(savedUser.reglage).toBeUndefined();
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Attempt to create user without required references
   * - Verify validation errors for contact, address, and password
   * - Ensure user data completeness and referential integrity
   */
  it('should fail when required fields are missing', async () => {
    const user = new User({});

    let error: any;
    try {
      await user.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.contact).toBeDefined();
    expect(error.errors.address).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  /**
   * __Default Values Assignment
   * Acceptance case (scenario)
   * - Create user without explicit blocked status
   * - Verify default blocked value is set to true
   * - Ensure automatic creation_date timestamp generation
   */
  it('should set default values correctly', async () => {
    const contactId = new mongoose.Types.ObjectId();
    const addressId = new mongoose.Types.ObjectId();
    const passwordId = new mongoose.Types.ObjectId();

    const userData = {
      contact: contactId,
      address: addressId,
      password: passwordId,
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.blocked).toBe(true);
    expect(savedUser.creation_date).toBeDefined();
  });

  /**
   * __JWT Token Generation
   * Acceptance case (scenario)
   * - Test authentication token generation functionality
   * - Verify token validity and structure
   * - Handle missing JWT secret configuration
   * - Ensure secure token creation for user authentication
   */
  describe('generateAuthToken', () => {
    /**
     * __Generate Valid JWT Token
     * Acceptance case (scenario)
     * - Generate authentication token for user
     * - Verify token is a valid JWT string
     * - Ensure token contains user ID and expiration
     */
    it('should generate a valid JWT token', () => {
      const user = new User(validUser);
      const token = user.generateAuthToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token!, mockJWTSecret);
      expect(decoded).toHaveProperty('_id');
      expect(decoded).toHaveProperty('exp');
    });

    /**
     * __Handle Missing JWT Secret
     * Acceptance case (scenario)
     * - Attempt token generation without JWT secret
     * - Verify null token is returned
     * - Ensure graceful handling of configuration errors
     */
    it('should handle missing JWT secret', () => {
      const originalJWTConfig = require('../../src/configs/envirementVariables').enirementVariables
        .JWTConfig;

      require('../../src/configs/envirementVariables').enirementVariables.JWTConfig = {
        JWTSecret: '',
      };

      const UserWithMockedConfig = require('../../src/Models/user/User.model').default;
      const user = new UserWithMockedConfig(validUser);

      const token = user.generateAuthToken();
      expect(token).toBeNull();

      require('../../src/configs/envirementVariables').enirementVariables.JWTConfig =
        originalJWTConfig;
    });
  });

  /**
   * __User Document Updates
   * Acceptance case (scenario)
   * - Update existing user fields
   * - Verify changes are persisted correctly
   * - Ensure reference updates maintain data integrity
   */
  it('should update the user document correctly', async () => {
    const user = new User(validUser);
    await user.save();

    const newBlockedStatus = true;
    const newContactId = new mongoose.Types.ObjectId();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { blocked: newBlockedStatus, contact: newContactId },
      { new: true },
    );

    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.blocked).toBe(newBlockedStatus);
    expect(updatedUser!.contact.toString()).toBe(newContactId.toString());
  });
});
