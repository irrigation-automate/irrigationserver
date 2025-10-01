/**
 * @file Test suite for UserAddress model
 * @description Unit tests for the UserAddress schema, including validation,
 * default values, and update hooks.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserAddress from '../../src/Models/user/User.adress';
import { IUserAddressSchema } from '../../src/interface/interfaces/models';

describe('UserAddress Model', () => {
  let mongoServer: MongoMemoryServer;
  
  /** 
   * @constant {Partial<IUserAddressSchema>} validAddress 
   * @description A valid address object used for testing schema persistence.
   */
  const validAddress: Partial<IUserAddressSchema> = {
    city: 'Tunis',
    street: 'Habib Bourguiba Avenue',
    codeZip: 1000,
  };

  beforeAll(async () => {
    /**
     * @description Start an in-memory MongoDB instance before all tests.
     */
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    /**
     * @description Clean up test data after each test.
     */
    await UserAddress.deleteMany({});
  });

  afterAll(async () => {
    /**
     * @description Disconnect from MongoDB and stop in-memory server after tests complete.
     */
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * @test
   * @description Should create and save a valid user address successfully.
   */
  it('should create and save a user address successfully', async () => {
    const address = new UserAddress(validAddress);
    const savedAddress = await address.save();

    expect(savedAddress._id).toBeDefined();
    expect(savedAddress.city).toBe(validAddress.city);
    expect(savedAddress.street).toBe(validAddress.street);
    expect(savedAddress.codeZip).toBe(validAddress.codeZip);
    expect(savedAddress.country).toBe('Tunisia'); // Default value
    expect(savedAddress.last_update).toBeDefined();
  });

  /**
   * @test
   * @description Should set country to "Tunisia" by default if not provided.
   */
  it('should set default country to "Tunisia" when not provided', async () => {
    const addressData = { ...validAddress };
    delete addressData.country;
    
    const address = new UserAddress(addressData);
    const savedAddress = await address.save();
    
    expect(savedAddress.country).toBe('Tunisia');
  });

  /**
   * @test
   * @description Should update the `last_update` timestamp whenever the document is modified.
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
   * @test
   * @description Should allow saving an address with only partial information (e.g., only city).
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
   * @test
   * @description Should throw validation error when `codeZip` is not a number.
   */
  it('should validate codeZip as a number', async () => {
    const invalidAddress = {
      ...validAddress,
      codeZip: 'not-a-number',
    };
    
    const address = new UserAddress(invalidAddress);
    
    let error;
    try {
      await address.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.codeZip).toBeDefined();
  });
});
