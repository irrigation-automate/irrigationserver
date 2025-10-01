/**
 * @file Test suite for UserContact model
 * @description
 * Validates the `UserContact` schema rules, including required fields,
 * email format, uniqueness, and automatic timestamp behavior.
 * Uses `mongodb-memory-server` for an isolated in-memory test database.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserContact from '../../src/Models/user/user.contact';
import { IUserContactSchema } from '../../src/interface/interfaces/models';

/**
 * Test suite for the `UserContact` model.
 */
describe('UserContact Model', () => {
  let mongoServer: MongoMemoryServer;

  /**
   * Valid user contact test data.
   */
  const validContact: Partial<IUserContactSchema> = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  /**
   * Setup: Start in-memory MongoDB and connect before all tests.
   */
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  /**
   * Cleanup: Remove all documents after each test to keep tests isolated.
   */
  afterEach(async () => {
    await UserContact.deleteMany({});
  });

  /**
   * Teardown: Disconnect from database and stop in-memory server after all tests.
   */
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * Test: Should create and save a user contact successfully with valid data.
   */
  it('should create and save a user contact successfully', async () => {
    const contact = new UserContact(validContact);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.email).toBe(validContact.email);
    expect(savedContact.firstName).toBe(validContact.firstName);
    expect(savedContact.lastName).toBe(validContact.lastName);
    expect(savedContact.last_update).toBeDefined();
  });

  /**
   * Test: Should fail validation when required fields are missing.
   */
  it('should fail when required fields are missing', async () => {
    const contact = new UserContact({});

    let error;
    try {
      await contact.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.email).toBeDefined();
    expect(error.errors.firstName).toBeDefined();
    expect(error.errors.lastName).toBeDefined();
  });

  /**
   * Test: Should fail validation when email format is invalid.
   */
  it('should fail when email is invalid', async () => {
    const contact = new UserContact({
      ...validContact,
      email: 'invalid-email',
    });

    let error;
    try {
      await contact.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.email).toBeDefined();
  });

  /**
   * Test: Should enforce unique constraint on email field.
   */
  it('should enforce unique email constraint', async () => {
    const contact1 = new UserContact(validContact);
    await contact1.save();

    const contact2 = new UserContact({
      ...validContact,
      firstName: 'Jane',
    });

    let error;
    try {
      await contact2.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  /**
   * Test: Should update `last_update` timestamp on save.
   */
  it('should update last_update timestamp on save', async () => {
    const contact = new UserContact(validContact);
    const savedContact = await contact.save();
    const initialUpdateTime = savedContact.last_update;

    savedContact.firstName = 'Updated';
    const updatedContact = await savedContact.save();

    expect(updatedContact.firstName).toBe('Updated');
    expect(updatedContact.last_update).toBeDefined();
    expect(updatedContact.last_update).not.toBe(initialUpdateTime);
  });
});
