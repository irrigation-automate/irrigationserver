/**
 * __Pump Model Unit Tests
 * Acceptance case (scenario)
 * - Create pump configurations with valid specifications
 * - Validate required field constraints
 * - Test enum constraints for pump types and status
 * - Verify numeric constraints for flow rate and pressure
 * - Handle health metrics validation
 * - Test default status assignment
 * - Validate data integrity across updates
 * - Test business logic for pump management
 * - Handle edge cases with various pump configurations
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import PumpModel from '../../src/Models/Pump.model';

describe('Pump Model', () => {
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
    await PumpModel.deleteMany({});
  });

  const validPumpData = {
    name: 'Main Irrigation Pump',
    type: 'centrifugal',
    status: 'active' as const,
    flowRate: 1000,
    pressure: 50,
  };

  /**
   * __Valid Pump Creation
   * Acceptance case (scenario)
   * - Create pump with valid data
   * - Verify pump creation with required fields
   * - Ensure proper data validation
   */
  describe('Valid Pump Creation', () => {
    /**
     * __Create Pump with Valid Data
     * Acceptance case (scenario)
     * - Create pump with valid specifications
     * - Verify pump creation with valid data
     * - Ensure proper data validation
     */
    it('should create a pump with valid data', async () => {
      const pump = new PumpModel(validPumpData);
      const savedPump = await pump.save();

      expect(savedPump._id).toBeDefined();
      expect(savedPump.name).toBe(validPumpData.name);
      expect(savedPump.type).toBe(validPumpData.type);
      expect(savedPump.status).toBe(validPumpData.status);
      expect(savedPump.flowRate).toBe(validPumpData.flowRate);
      expect(savedPump.pressure).toBe(validPumpData.pressure);
      expect(savedPump.createdAt).toBeDefined();
      expect(savedPump.updatedAt).toBeDefined();
    });

    /**
     * __Create Pump with Health Metrics
     * Acceptance case (scenario)
     * - Create pump with health metrics
     * - Verify health metrics validation
     * - Ensure proper health metrics assignment
     */
    it('should create a pump with health metrics', async () => {
      const pumpDataWithHealth = {
        ...validPumpData,
        health: {
          temperature: 25,
          vibration: 0.5,
          efficiency: 85,
          lastMaintenance: new Date('2023-01-01'),
          maintenanceDue: new Date('2023-07-01'),
        },
      };

      const pump = new PumpModel(pumpDataWithHealth);
      const savedPump = await pump.save();

      expect(savedPump.health).toBeDefined();
      expect(savedPump.health!.temperature).toBe(25);
      expect(savedPump.health!.vibration).toBe(0.5);
      expect(savedPump.health!.efficiency).toBe(85);
      expect(savedPump.health!.lastMaintenance).toEqual(new Date('2023-01-01'));
      expect(savedPump.health!.maintenanceDue).toEqual(new Date('2023-07-01'));
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure pump integrity by enforcing field requirements
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required name Field
     * Acceptance case (scenario)
     * - Attempt to save pump without name
     * - Verify validation error is thrown
     * - Ensure pump identification
     */
    it('should require name field', async () => {
      const pumpData = { ...validPumpData, name: undefined };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    /**
     * __Validate Required type Field
     * Acceptance case (scenario)
     * - Attempt to save pump without type
     * - Verify validation error is thrown
     * - Ensure pump type classification
     */
    it('should require type field', async () => {
      const pumpData = { ...validPumpData, type: undefined };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.type).toBeDefined();
    });

    /**
     * __Validate Required status Field
     * Acceptance case (scenario)
     * - Attempt to save pump without status
     * - Verify validation error is thrown
     * - Ensure pump operational status tracking
     */
    it('should require status field', async () => {
      const pumpData = { ...validPumpData, status: undefined };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });

    /**
     * __Validate Required flowRate Field
     * Acceptance case (scenario)
     * - Attempt to save pump without flowRate
     * - Verify validation error is thrown
     * - Ensure pump performance specification
     */
    it('should require flowRate field', async () => {
      const pumpData = { ...validPumpData, flowRate: undefined };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.flowRate).toBeDefined();
    });

    /**
     * __Validate Required pressure Field
     * Acceptance case (scenario)
     * - Attempt to save pump without pressure
     * - Verify validation error is thrown
     * - Ensure pump operating pressure specification
     */
    it('should require pressure field', async () => {
      const pumpData = { ...validPumpData, pressure: undefined };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.pressure).toBeDefined();
    });
  });

  describe('Field Constraints', () => {
    it('should enforce name maxlength constraint', async () => {
      const longName = 'a'.repeat(101);
      const pumpData = { ...validPumpData, name: longName };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    it('should enforce flowRate min constraint', async () => {
      const pumpData = { ...validPumpData, flowRate: -1 };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.flowRate).toBeDefined();
    });

    /**
     * __Validate Flow Rate Maximum Constraint
     * Acceptance case (scenario)
     * - Test maximum flow rate boundary (1000 L/min)
     * - Verify extremely high flow rates are rejected
     * - Ensure realistic pump performance values
     */
    it('should enforce flowRate max constraint', async () => {
      const pumpData = { ...validPumpData, flowRate: 15000 };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.flowRate).toBeDefined();
    });

    /**
     * __Validate Pressure Minimum Constraint
     * Acceptance case (scenario)
     * - Test minimum pressure boundary (1 PSI)
     * - Verify zero or negative pressure values are rejected
     * - Ensure positive pump operating pressure
     */
    it('should enforce pressure min constraint', async () => {
      const pumpData = { ...validPumpData, pressure: -1 };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.pressure).toBeDefined();
    });

    /**
     * __Validate Pressure Maximum Constraint
     * Acceptance case (scenario)
     * - Test maximum pressure boundary (200 PSI)
     * - Verify extremely high pressure values are rejected
     * - Ensure safe pump operating pressure
     */
    it('should enforce pressure max constraint', async () => {
      const pumpData = { ...validPumpData, pressure: 250 };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.pressure).toBeDefined();
    });
  });

  /**
   * __Enum Validation
   * Acceptance case (scenario)
   * - Test enum constraints for pump type and status
   * - Verify only valid enumerated values are accepted
   * - Maintain data consistency with predefined options
   * - Ensure proper pump classification
   */
  describe('Enum Validation', () => {
    /**
     * __Validate Type Enum Constraint
     * Acceptance case (scenario)
     * - Test invalid pump type value rejection
     * - Verify only valid pump types are accepted
     * - Ensure proper pump classification
     */
    it('should enforce type enum constraint', async () => {
      const pumpData = { ...validPumpData, type: 'invalid_type' };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.type).toBeDefined();
    });

    /**
     * __Validate Status Enum Constraint
     * Acceptance case (scenario)
     * - Test invalid pump status value rejection
     * - Verify only valid pump statuses are accepted
     * - Ensure proper operational status tracking
     */
    it('should enforce status enum constraint', async () => {
      const pumpData = { ...validPumpData, status: 'invalid_status' };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });
  });

  /**
   * __Health Metrics Validation
   * Acceptance case (scenario)
   * - Test health metrics value constraints
   * - Verify temperature, efficiency, and vibration ranges
   * - Validate pump health monitoring data
   * - Ensure pump diagnostic data quality
   */
  describe('Health Metrics Validation', () => {
    /**
     * __Validate Health Temperature Range
     * Acceptance case (scenario)
     * - Test maximum temperature boundary (100°C)
     * - Verify overheating conditions are flagged
     * - Ensure pump temperature monitoring accuracy
     */
    it('should validate health temperature range', async () => {
      const pumpData = {
        ...validPumpData,
        health: { temperature: 150 },
      };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['health.temperature']).toBeDefined();
    });

    /**
     * __Validate Health Efficiency Range
     * Acceptance case (scenario)
     * - Test efficiency percentage boundaries (0-100%)
     * - Verify unrealistic efficiency values are rejected
     * - Ensure pump performance monitoring accuracy
     */
    it('should validate health efficiency range', async () => {
      const pumpData = {
        ...validPumpData,
        health: { efficiency: 150 },
      };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['health.efficiency']).toBeDefined();
    });

    /**
     * __Validate Health Vibration Minimum
     * Acceptance case (scenario)
     * - Test minimum vibration boundary (0 mm/s)
     * - Verify negative vibration values are rejected
     * - Ensure pump mechanical health monitoring
     */
    it('should validate health vibration minimum', async () => {
      const pumpData = {
        ...validPumpData,
        health: { vibration: -1 },
      };

      const pump = new PumpModel(pumpData);

      let error: any;
      try {
        await pump.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['health.vibration']).toBeDefined();
    });
  });

  describe('Default Values', () => {
    it('should set default status to inactive', async () => {
      const pumpData = { ...validPumpData, status: undefined };

      const pump = new PumpModel(pumpData);
      const savedPump = await pump.save();

      expect(savedPump.status).toBe('inactive');
    });
  });
});
