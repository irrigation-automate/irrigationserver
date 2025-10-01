/**
 * @file Test suite for UserPassword model
 * @description
 * Validates the `UserPassword` schema rules, including:
 * - Required fields
 * - Password hashing with bcrypt
 * - Automatic timestamp updates
 * Uses `mongodb-memory-server` for an isolated in-memory database.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import UserPassword from '../../src/Models/user/user.password';
import { IUserPasswordSchema } from '../../src/interface/interfaces/models';

/**
 * Test suite for the `UserPassword` schema and model.
 */
describe('UserPassword Model', () => {
  let mongoServer: MongoMemoryServer;
  
  /**
   * @constant {Partial<IUserPasswordSchema>} validPassword
   * @description A valid password object used for positive test cases.
   */
  const validPassword: Partial<IUserPasswordSchema> = {
    password: 'Test@1234',
  };

  /**
   * @lifecycle beforeAll
   * @description Setup: Start in-memory MongoDB and connect before all tests.
   */
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  /**
   * @lifecycle afterEach
   * @description Cleanup: Remove all password documents after each test to ensure isolation.
   */
  afterEach(async () => {
    await UserPassword.deleteMany({});
  });

  /**
   * @lifecycle afterAll
   * @description Teardown: Disconnect database and stop the in-memory server after all tests finish.
   */
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * @test
   * @description Should create and save a password document successfully, hashing the password.
   */
  it('should create and save a user password successfully', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();

    expect(savedPassword._id).toBeDefined();
    expect(savedPassword.password).not.toBe(validPassword.password);
    expect(savedPassword.last_update).toBeDefined();
    
    const isMatch = await bcrypt.compare(validPassword.password!, savedPassword.password);
    expect(isMatch).toBe(true);
  });

  /**
   * @test
   * @description Should fail validation if password field is missing.
   */
  it('should fail when password is not provided', async () => {
    const password = new UserPassword({});
    
    let error: mongoose.Error.ValidationError | undefined;
    try {
      await password.validate();
    } catch (e) {
      error = e as mongoose.Error.ValidationError;
    }
    
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error?.errors.password).toBeDefined();
  });

  /**
   * @test
   * @description Should hash the password before saving to the database.
   */
  it('should hash the password before saving', async () => {
    const password = new UserPassword(validPassword);
    await password.save();
    
    expect(password.password).not.toBe(validPassword.password);
    
    const isMatch = await bcrypt.compare(validPassword.password!, password.password);
    expect(isMatch).toBe(true);
  });

  /**
   * @test
   * @description Should update the `last_update` timestamp when the password is modified.
   */
  it('should update last_update timestamp on save', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();
    const initialUpdateTime = savedPassword.last_update;
    
    savedPassword.password = 'NewPassword@123';
    const updatedPassword = await savedPassword.save();
    
    expect(updatedPassword.password).not.toBe('NewPassword@123');
    expect(updatedPassword.last_update.getTime()).toBeGreaterThan(initialUpdateTime.getTime());
  });

  /**
   * @test
   * @description Should not rehash the password if it has not been modified.
   */
  it('should not rehash the password if it was not modified', async () => {
    const password = new UserPassword(validPassword);
    const savedPassword = await password.save();
    const initialHash = savedPassword.password;
    
    savedPassword.markModified('last_update');
    await savedPassword.save();
    
    expect(savedPassword.password).toBe(initialHash);
  });
});
