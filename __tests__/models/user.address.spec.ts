/**
 * __UserAddress Model Unit Tests
 * Acceptance case (scenario)
 * - Create user addresses with valid location data
 * - Validate field type constraints
 * - Test default country assignment
 * - Verify timestamp updates on modifications
 * - Handle partial address information
 * - Test data integrity and persistence
 * - Validate numeric field type enforcement
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserAddress from '../../src/Models/user/User.adress';
import { IUserAddressSchema } from '../../src/interface/interfaces/models';

/**
 * __UserAddress Model Unit Tests
 * Acceptance case (scenario)
 * - Create user addresses with valid location data
 * - Validate field type constraints
 * - Test default country assignment
 * - Verify timestamp updates on modifications
 * - Handle partial address information
 * - Test data integrity and persistence
 * - Validate numeric field type enforcement
 */
describe('UserAddress Model', () => {
  let mongoServer: MongoMemoryServer;

  const validAddress: Partial<IUserAddressSchema> = {
    city: 'Tunis',
    street: 'Habib Bourguiba Avenue',
    codeZip: 1000,
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await UserAddress.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * __Valid Address Creation
   * Acceptance case (scenario)
   * - Create address with complete location data
   * - Verify saved document contains valid values
   * - Ensure default country and timestamp generation
   */
  it('should create and save a user address successfully', async () => {
    const address = new UserAddress(validAddress);
    const savedAddress = await address.save();

    expect(savedAddress._id).toBeDefined();
    expect(savedAddress.city).toBe(validAddress.city);
    expect(savedAddress.street).toBe(validAddress.street);
    expect(savedAddress.codeZip).toBe(validAddress.codeZip);
    expect(savedAddress.country).toBe('Tunisia');
    expect(savedAddress.last_update).toBeDefined();
  });

  /**
   * __Default Country Assignment
   * Acceptance case (scenario)
   * - Create address without explicit country field
   * - Verify default country is set to "Tunisia"
   * - Ensure regional default behavior
   */
  it('should set default country to "Tunisia" when not provided', async () => {
    const addressData = { ...validAddress };
    delete addressData.country;

    const address = new UserAddress(addressData);
    const savedAddress = await address.save();

    expect(savedAddress.country).toBe('Tunisia');
  });

  /**
   * __Timestamp Update on Modification
   * Acceptance case (scenario)
   * - Modify existing address data
   * - Verify last_update timestamp is refreshed
   * - Ensure change tracking mechanism
   */
  it('should update last_update timestamp on save', async () => {
    const address = new UserAddress(validAddress);
    const savedAddress = await address.save();
    const initialUpdateTime = savedAddress.last_update;

    savedAddress.city = 'Sfax';
    const updatedAddress = await savedAddress.save();

    expect(updatedAddress.city).toBe('Sfax');
    expect(updatedAddress.last_update.getTime()).toBeGreaterThan(initialUpdateTime.getTime());
  });

  /**
   * __Partial Address Information
   * Acceptance case (scenario)
   * - Create address with minimal required fields
   * - Verify partial data is accepted
   * - Ensure flexible address storage
   */
  it('should allow partial address information', async () => {
    const partialAddress = { city: 'Sousse' };
    const address = new UserAddress(partialAddress);
    const savedAddress = await address.save();

    expect(savedAddress._id).toBeDefined();
    expect(savedAddress.city).toBe('Sousse');
    expect(savedAddress.street).toBeUndefined();
    expect(savedAddress.codeZip).toBeUndefined();
  });

  /**
   * __CodeZip Numeric Type Validation
   * Acceptance case (scenario)
   * - Attempt to save non-numeric codeZip value
   * - Verify validation error is thrown
   * - Ensure postal code data integrity
   */
  it('should validate codeZip as a number', async () => {
    const invalidAddress = {
      ...validAddress,
      codeZip: 'not-a-number',
    };
    const address = new UserAddress(invalidAddress);

    let error: any;
    try {
      await address.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.codeZip).toBeDefined();
  });
});
