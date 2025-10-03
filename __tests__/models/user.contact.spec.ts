/**
 * __UserContact Model Unit Tests
 * Acceptance case (scenario)
 * - Create user contacts with valid personal information
 * - Validate required field constraints
 * - Test email format validation
 * - Verify unique email constraint enforcement
 * - Test timestamp updates on modifications
 * - Ensure data integrity and persistence
 * - Handle validation errors appropriately
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserContact from '../../src/Models/user/user.contact';
import { IUserContactSchema } from '../../src/interface/interfaces/models';

/**
 * __UserContact Model Unit Tests
 * Acceptance case (scenario)
 * - Create user contacts with valid personal information
 * - Validate required field constraints
 * - Test email format validation
 * - Verify unique email constraint enforcement
 * - Test timestamp updates on modifications
 * - Ensure data integrity and persistence
 * - Handle validation errors appropriately
 */
describe('UserContact Model', () => {
  let mongoServer: MongoMemoryServer;

  const validContact: Partial<IUserContactSchema> = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await UserContact.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * __Valid Contact Creation
   * Acceptance case (scenario)
   * - Create contact with all required fields
   * - Verify saved document contains valid values
   * - Ensure automatic timestamp generation
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
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Attempt to create contact without required fields
   * - Verify validation errors for email, firstName, and lastName
   * - Ensure contact data completeness
   */
  it('should fail when required fields are missing', async () => {
    const contact = new UserContact({});
    let error: any;

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
   * __Email Format Validation
   * Acceptance case (scenario)
   * - Attempt to save contact with invalid email format
   * - Verify validation error is thrown
   * - Ensure email address integrity
   */
  it('should fail when email is invalid', async () => {
    const contact = new UserContact({
      ...validContact,
      email: 'invalid-email',
    });
    let error: any;

    try {
      await contact.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.email).toBeDefined();
  });

  /**
   * __Unique Email Constraint
   * Acceptance case (scenario)
   * - Create two contacts with identical email addresses
   * - Verify duplicate key error is thrown
   * - Ensure email uniqueness across system
   */
  it('should enforce unique email constraint', async () => {
    const contact1 = new UserContact(validContact);
    await contact1.save();

    const contact2 = new UserContact({
      ...validContact,
      firstName: 'Jane',
    });
    let error: any;

    try {
      await contact2.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  /**
   * __Timestamp Update on Modification
   * Acceptance case (scenario)
   * - Modify existing contact data
   * - Verify last_update timestamp is refreshed
   * - Ensure change tracking mechanism
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
