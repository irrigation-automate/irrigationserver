import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ZoneModel from '../../src/Models/Zone.model';

/**
 * __Zone Model Unit Tests
 * Acceptance case (scenario)
 * - Create irrigation zones with valid geographic data
 * - Validate required field constraints
 * - Test enum constraints for vegetation and soil types
 * - Verify coordinate validation for geographic boundaries
 * - Handle area constraints for zone sizing
 * - Test default status assignment
 * - Validate data integrity across updates
 * - Test business logic for zone management
 * - Handle edge cases with various zone configurations
 */
describe('Zone Model', () => {
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
    await ZoneModel.deleteMany({});
  });

  const validZoneData = {
    name: 'North Garden Zone',
    pumpId: '507f1f77bcf86cd799439011',
    status: 'active' as const,
    area: 500,
    vegetationType: 'grass',
    soilType: 'loam',
    coordinates: [
      { latitude: 40.7128, longitude: -74.006 },
      { latitude: 40.713, longitude: -74.0055 },
      { latitude: 40.7125, longitude: -74.0058 },
    ],
  };

  /**
   * __Valid Zone Creation
   * Acceptance case (scenario)
   * - Create zone with all required fields and valid data
   * - Verify saved document contains correct field values
   * - Ensure coordinate arrays are properly stored
   * - Validate automatic timestamp generation
   * - Test optional lastWatered field functionality
   */
  describe('Valid Zone Creation', () => {
    /**
     * __Complete Zone Data Creation
     * Acceptance case (scenario)
     * - Create zone with all mandatory and optional fields
     * - Verify all field values are correctly persisted
     * - Ensure geographic coordinates maintain precision
     * - Validate automatic timestamp assignment
     */
    it('should create a zone with valid data', async () => {
      const zone = new ZoneModel(validZoneData);
      const savedZone = await zone.save();

      expect(savedZone._id).toBeDefined();
      expect(savedZone.name).toBe(validZoneData.name);
      expect(savedZone.pumpId).toBe(validZoneData.pumpId);
      expect(savedZone.status).toBe(validZoneData.status);
      expect(savedZone.area).toBe(validZoneData.area);
      expect(savedZone.vegetationType).toBe(validZoneData.vegetationType);
      expect(savedZone.soilType).toBe(validZoneData.soilType);
      expect(savedZone.coordinates).toHaveLength(validZoneData.coordinates.length);
      expect(savedZone.coordinates[0].latitude).toBe(validZoneData.coordinates[0].latitude);
      expect(savedZone.coordinates[0].longitude).toBe(validZoneData.coordinates[0].longitude);
      expect(savedZone.coordinates[1].latitude).toBe(validZoneData.coordinates[1].latitude);
      expect(savedZone.coordinates[1].longitude).toBe(validZoneData.coordinates[1].longitude);
      expect(savedZone.createdAt).toBeDefined();
      expect(savedZone.updatedAt).toBeDefined();
    });

    /**
     * __Optional Timestamp Field
     * Acceptance case (scenario)
     * - Create zone with lastWatered timestamp
     * - Verify custom timestamp is correctly stored
     * - Ensure optional field doesn't affect required validation
     */
    it('should create a zone with lastWatered timestamp', async () => {
      const zoneDataWithLastWatered = {
        ...validZoneData,
        lastWatered: new Date('2023-06-15T10:30:00Z'),
      };

      const zone = new ZoneModel(zoneDataWithLastWatered);
      const savedZone = await zone.save();

      expect(savedZone.lastWatered).toEqual(new Date('2023-06-15T10:30:00Z'));
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test each mandatory field for validation requirements
   * - Verify appropriate error messages for missing fields
   * - Ensure data completeness for zone operations
   * - Validate schema enforcement for critical fields
   */
  describe('Required Field Validation', () => {
    /**
     * __Name Field Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without name
     * - Verify validation error for missing name field
     * - Ensure zone identification integrity
     */
    it('should require name field', async () => {
      const zoneData = { ...validZoneData, name: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    /**
     * __Pump ID Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without pump reference
     * - Verify validation error for missing pumpId
     * - Ensure equipment association integrity
     */
    it('should require pumpId field', async () => {
      const zoneData = { ...validZoneData, pumpId: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.pumpId).toBeDefined();
    });

    /**
     * __Area Field Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without area specification
     * - Verify validation error for missing area
     * - Ensure irrigation calculation data completeness
     */
    it('should require area field', async () => {
      const zoneData = { ...validZoneData, area: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.area).toBeDefined();
    });

    /**
     * __Vegetation Type Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without vegetation type
     * - Verify validation error for missing vegetationType
     * - Ensure water requirement calculation integrity
     */
    it('should require vegetationType field', async () => {
      const zoneData = { ...validZoneData, vegetationType: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.vegetationType).toBeDefined();
    });

    /**
     * __Soil Type Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without soil type
     * - Verify validation error for missing soilType
     * - Ensure irrigation absorption rate calculation integrity
     */
    it('should require soilType field', async () => {
      const zoneData = { ...validZoneData, soilType: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.soilType).toBeDefined();
    });

    /**
     * __Coordinates Requirement
     * Acceptance case (scenario)
     * - Attempt zone creation without geographic coordinates
     * - Verify validation error for missing coordinates
     * - Ensure spatial data completeness for zone mapping
     */
    it('should require coordinates field', async () => {
      const zoneData = { ...validZoneData, coordinates: undefined };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.coordinates).toBeDefined();
    });
  });

  /**
   * __Field Constraints Validation
   * Acceptance case (scenario)
   * - Test field length and value range constraints
   * - Verify boundary condition enforcement
   * - Ensure data quality through schema validation
   * - Handle edge cases for numeric and string fields
   */
  describe('Field Constraints', () => {
    /**
     * __Name Length Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with excessively long name
     * - Verify maxlength constraint enforcement
     * - Ensure database performance and UI compatibility
     */
    it('should enforce name maxlength constraint', async () => {
      const longName = 'a'.repeat(101);
      const zoneData = { ...validZoneData, name: longName };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    /**
     * __Minimum Area Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with negative area value
     * - Verify minimum area constraint enforcement
     * - Prevent invalid irrigation calculations
     */
    it('should enforce area min constraint', async () => {
      const zoneData = { ...validZoneData, area: -1 };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.area).toBeDefined();
    });

    /**
     * __Maximum Area Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with excessively large area
     * - Verify maximum area constraint enforcement
     * - Ensure realistic zone sizing and system capacity
     */
    it('should enforce area max constraint', async () => {
      const zoneData = { ...validZoneData, area: 2000000 };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.area).toBeDefined();
    });
  });

  /**
   * __Enum Value Validation
   * Acceptance case (scenario)
   * - Test predefined enum value constraints
   * - Verify invalid enum value rejection
   * - Ensure data consistency across zone types
   * - Validate business logic enforcement
   */
  describe('Enum Validation', () => {
    /**
     * __Status Enum Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with invalid status value
     * - Verify status enum constraint enforcement
     * - Maintain consistent zone state management
     */
    it('should enforce status enum constraint', async () => {
      const zoneData = { ...validZoneData, status: 'invalid_status' };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });

    /**
     * __Vegetation Type Enum Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with invalid vegetation type
     * - Verify vegetationType enum constraint enforcement
     * - Ensure supported plant type compatibility
     */
    it('should enforce vegetationType enum constraint', async () => {
      const zoneData = { ...validZoneData, vegetationType: 'invalid_type' };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.vegetationType).toBeDefined();
    });

    /**
     * __Soil Type Enum Constraint
     * Acceptance case (scenario)
     * - Attempt zone creation with invalid soil type
     * - Verify soilType enum constraint enforcement
     * - Ensure supported soil type compatibility
     */
    it('should enforce soilType enum constraint', async () => {
      const zoneData = { ...validZoneData, soilType: 'invalid_type' };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.soilType).toBeDefined();
    });
  });

  /**
   * __Geographic Coordinates Validation
   * Acceptance case (scenario)
   * - Test coordinate value range validation
   * - Verify latitude and longitude completeness
   * - Ensure valid geographic boundary definitions
   * - Handle malformed coordinate data scenarios
   */
  describe('Coordinates Validation', () => {
    /**
     * __Latitude Range Validation
     * Acceptance case (scenario)
     * - Attempt zone creation with invalid latitude value
     * - Verify latitude range constraint (-90 to 90)
     * - Prevent geographically impossible zone definitions
     */
    it('should validate latitude range', async () => {
      const zoneData = {
        ...validZoneData,
        coordinates: [{ latitude: 100, longitude: -74.006 }],
      };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['coordinates.0.latitude']).toBeDefined();
    });

    /**
     * __Longitude Range Validation
     * Acceptance case (scenario)
     * - Attempt zone creation with invalid longitude value
     * - Verify longitude range constraint (-180 to 180)
     * - Ensure realistic geographic positioning
     */
    it('should validate longitude range', async () => {
      const zoneData = {
        ...validZoneData,
        coordinates: [{ latitude: 40.7128, longitude: -200 }],
      };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['coordinates.0.longitude']).toBeDefined();
    });

    /**
     * __Coordinate Completeness Validation
     * Acceptance case (scenario)
     * - Attempt zone creation with incomplete coordinate pairs
     * - Verify both latitude and longitude are required
     * - Ensure complete geographic point definitions
     */
    it('should require both latitude and longitude in coordinates', async () => {
      const zoneData = {
        ...validZoneData,
        coordinates: [{ latitude: 40.7128 }],
      };

      const zone = new ZoneModel(zoneData);

      let error: any;
      try {
        await zone.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['coordinates.0.longitude']).toBeDefined();
    });
  });

  /**
   * __Default Value Assignment
   * Acceptance case (scenario)
   * - Test automatic default value assignment
   * - Verify timestamp generation functionality
   * - Ensure consistent zone state initialization
   * - Validate system-generated field population
   */
  describe('Default Values', () => {
    /**
     * __Default Status Assignment
     * Acceptance case (scenario)
     * - Create zone without explicit status specification
     * - Verify default 'active' status assignment
     * - Ensure consistent zone state initialization
     */
    it('should set default status to active', async () => {
      const zoneData = { ...validZoneData, status: undefined };

      const zone = new ZoneModel(zoneData);
      const savedZone = await zone.save();

      expect(savedZone.status).toBe('active');
    });

    /**
     * __Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create zone and verify automatic timestamp creation
     * - Ensure createdAt and updatedAt are properly set
     * - Validate timestamp synchronization on creation
     */
    it('should set timestamps', async () => {
      const zone = new ZoneModel(validZoneData);
      const savedZone = await zone.save();

      expect(savedZone.createdAt).toBeInstanceOf(Date);
      expect(savedZone.updatedAt).toBeInstanceOf(Date);
      expect(savedZone.createdAt.getTime()).toBe(savedZone.updatedAt.getTime());
    });
  });
});
