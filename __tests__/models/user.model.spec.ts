/**
 * @file Test suite for the User model
 * @description
 * Contains unit tests for the `User` schema, covering:
 * - Required fields and schema validation
 * - References to other models (`UserContact`, `UserAddress`, `UserPassword`)
 * - Default values
 * - JWT token generation via the `generateAuthToken` method
 * - Document updates
 *
 * Uses `mongodb-memory-server` to provide an isolated in-memory MongoDB instance
 * for testing without affecting a real database.
 *
 * @module tests/models/user/User.model.test
 */

// Define the mock JWT secret first
const mockJWTSecret = 'test-secret-key';

// Mock environment variables before importing the User model
jest.mock('../../src/configs/envirementVariables', () => ({
  enirementVariables: {
    JWTConfig: {
      JWTSecret: mockJWTSecret,
    },
  },
}));

// Import required modules after setting up mocks
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../../src/Models/user/User.model';

/** Mock the referenced models */
jest.mock('../../src/Models/user/user.contact');
jest.mock('../../src/Models/user/User.adress');
jest.mock('../../src/Models/user/user.password');

/**
 * Test suite for the `User` model.
 */
describe('User Model', () => {
  let mongoServer: MongoMemoryServer;

  /** Test data for creating a valid user */
  let validUser: any;

  /**
   * Setup: Start in-memory MongoDB and connect before all tests
   */
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

  /**
   * Cleanup: Remove all documents after each test to keep tests isolated
   */
  afterEach(async () => {
    await User.deleteMany({});
  });

  /**
   * Teardown: Disconnect and stop in-memory MongoDB after all tests
   */
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  /**
   * @test
   * Should create and save a user successfully with all required fields
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
   * @test
   * Should throw a validation error when required fields are missing
   */
  it('should fail when required fields are missing', async () => {
    const user = new User({});

    let error;
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
   * @test
   * Should set default values correctly when fields are not provided
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

    expect(savedUser.blocked).toBe(true); // Default value from schema
    expect(savedUser.creation_date).toBeDefined();
  });

  /**
   * Test suite for `generateAuthToken` method
   */
  describe('generateAuthToken', () => {
    /**
     * @test
     * Should generate a valid JWT token containing the user's `_id`
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
     * @test
     * Should return null if JWT secret is missing
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
   * @test
   * Should update user document fields correctly
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
