/**
 * __WaterUsage Model Unit Tests
 * Acceptance case (scenario)
 * - Create water usage records with valid data
 * - Validate required field constraints
 * - Test field value constraints for measurements
 * - Validate weather conditions data structure
 * - Test default timestamp generation
 * - Verify data consistency across updates
 * - Handle business logic for water usage calculations
 * - Test edge cases with zero values
 * - Validate date range operations
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import WaterUsageModel from '../../src/Models/WaterUsage.model';

describe('WaterUsage Model', () => {
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
    await WaterUsageModel.deleteMany({});
  });

  const validWaterUsageData = {
    zoneId: '507f1f77bcf86cd799439011',
    startDate: new Date('2023-06-15T08:00:00Z'),
    endDate: new Date('2023-06-15T08:30:00Z'),
    waterUsedLiters: 150.5,
    durationMinutes: 30,
    averageFlowRate: 5.02,
  };

  const validWaterUsageWithWeather = {
    ...validWaterUsageData,
    weatherConditions: {
      temperature: 25,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
    },
  };

  /**
   * __Valid WaterUsage Creation
   * Acceptance case (scenario)
   * - Create water usage records with complete data
   * - Verify all fields are properly saved
   * - Test optional weather conditions inclusion
   * - Validate partial weather data handling
   */
  describe('Valid WaterUsage Creation', () => {
    /**
     * __Create Basic Water Usage Record
     * Acceptance case (scenario)
     * - Create water usage with all required fields
     * - Verify document is saved with correct data
     * - Check timestamps are generated
     */
    it('should create a water usage record with valid data', async () => {
      const waterUsage = new WaterUsageModel(validWaterUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage._id).toBeDefined();
      expect(savedWaterUsage.zoneId).toBe(validWaterUsageData.zoneId);
      expect(savedWaterUsage.startDate).toEqual(validWaterUsageData.startDate);
      expect(savedWaterUsage.endDate).toEqual(validWaterUsageData.endDate);
      expect(savedWaterUsage.waterUsedLiters).toBe(validWaterUsageData.waterUsedLiters);
      expect(savedWaterUsage.durationMinutes).toBe(validWaterUsageData.durationMinutes);
      expect(savedWaterUsage.averageFlowRate).toBe(validWaterUsageData.averageFlowRate);
      expect(savedWaterUsage.createdAt).toBeDefined();
      expect(savedWaterUsage.updatedAt).toBeDefined();
    });

    /**
     * __Create Water Usage with Weather Data
     * Acceptance case (scenario)
     * - Create water usage with weather conditions
     * - Verify weather data is properly stored
     * - Test complete weather object handling
     */
    it('should create a water usage record with weather conditions', async () => {
      const waterUsage = new WaterUsageModel(validWaterUsageWithWeather);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.weatherConditions).toBeDefined();
      expect(savedWaterUsage.weatherConditions!.temperature).toBe(25);
      expect(savedWaterUsage.weatherConditions!.humidity).toBe(65);
      expect(savedWaterUsage.weatherConditions!.windSpeed).toBe(12);
      expect(savedWaterUsage.weatherConditions!.precipitation).toBe(0);
    });

    /**
     * __Create Water Usage with Partial Weather Data
     * Acceptance case (scenario)
     * - Create water usage with incomplete weather data
     * - Verify partial data is handled correctly
     * - Test optional weather fields behavior
     */
    it('should create a water usage record with minimal weather data', async () => {
      const partialWeatherData = {
        ...validWaterUsageData,
        weatherConditions: {
          temperature: 20,
        },
      };

      const waterUsage = new WaterUsageModel(partialWeatherData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.weatherConditions).toBeDefined();
      expect(savedWaterUsage.weatherConditions!.temperature).toBe(20);
      expect(savedWaterUsage.weatherConditions!.humidity).toBeUndefined();
      expect(savedWaterUsage.weatherConditions!.windSpeed).toBeUndefined();
      expect(savedWaterUsage.weatherConditions!.precipitation).toBeUndefined();
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure data integrity by enforcing field requirements
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required zoneId Field
     * Acceptance case (scenario)
     * - Attempt to save without zoneId
     * - Verify validation error is thrown
     * - Ensure referential integrity
     */
    it('should require zoneId field', async () => {
      const waterUsageData = { ...validWaterUsageData, zoneId: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.zoneId).toBeDefined();
    });

    /**
     * __Validate Required startDate Field
     * Acceptance case (scenario)
     * - Attempt to save without startDate
     * - Verify validation error is thrown
     * - Ensure temporal data integrity
     */
    it('should require startDate field', async () => {
      const waterUsageData = { ...validWaterUsageData, startDate: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.startDate).toBeDefined();
    });

    /**
     * __Validate Required endDate Field
     * Acceptance case (scenario)
     * - Attempt to save without endDate
     * - Verify validation error is thrown
     * - Ensure complete time period definition
     */
    it('should require endDate field', async () => {
      const waterUsageData = { ...validWaterUsageData, endDate: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.endDate).toBeDefined();
    });

    /**
     * __Validate Required waterUsedLiters Field
     * Acceptance case (scenario)
     * - Attempt to save without waterUsedLiters
     * - Verify validation error is thrown
     * - Ensure water consumption tracking
     */
    it('should require waterUsedLiters field', async () => {
      const waterUsageData = { ...validWaterUsageData, waterUsedLiters: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.waterUsedLiters).toBeDefined();
    });

    /**
     * __Validate Required durationMinutes Field
     * Acceptance case (scenario)
     * - Attempt to save without durationMinutes
     * - Verify validation error is thrown
     * - Ensure irrigation duration tracking
     */
    it('should require durationMinutes field', async () => {
      const waterUsageData = { ...validWaterUsageData, durationMinutes: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.durationMinutes).toBeDefined();
    });

    /**
     * __Validate Required averageFlowRate Field
     * Acceptance case (scenario)
     * - Attempt to save without averageFlowRate
     * - Verify validation error is thrown
     * - Ensure flow rate monitoring
     */
    it('should require averageFlowRate field', async () => {
      const waterUsageData = { ...validWaterUsageData, averageFlowRate: undefined };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.averageFlowRate).toBeDefined();
    });
  });

  /**
   * __Field Constraints Validation
   * Acceptance case (scenario)
   * - Test minimum value constraints for measurements
   * - Verify negative values are rejected
   * - Ensure data quality for irrigation metrics
   */
  describe('Field Constraints', () => {
    /**
     * __Validate waterUsedLiters Minimum Constraint
     * Acceptance case (scenario)
     * - Attempt to save with negative water usage
     * - Verify validation error for invalid measurements
     * - Ensure positive water consumption values
     */
    it('should enforce waterUsedLiters min constraint', async () => {
      const waterUsageData = { ...validWaterUsageData, waterUsedLiters: -1 };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.waterUsedLiters).toBeDefined();
    });

    /**
     * __Validate durationMinutes Minimum Constraint
     * Acceptance case (scenario)
     * - Attempt to save with negative duration
     * - Verify validation error for invalid time periods
     * - Ensure positive irrigation duration
     */
    it('should enforce durationMinutes min constraint', async () => {
      const waterUsageData = { ...validWaterUsageData, durationMinutes: -1 };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.durationMinutes).toBeDefined();
    });

    /**
     * __Validate averageFlowRate Minimum Constraint
     * Acceptance case (scenario)
     * - Attempt to save with negative flow rate
     * - Verify validation error for invalid measurements
     * - Ensure positive flow rate values
     */
    it('should enforce averageFlowRate min constraint', async () => {
      const waterUsageData = { ...validWaterUsageData, averageFlowRate: -1 };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.averageFlowRate).toBeDefined();
    });
  });

  /**
   * __Weather Conditions Validation
   * Acceptance case (scenario)
   * - Test temperature range constraints for weather data
   * - Validate humidity percentage ranges
   * - Verify wind speed value constraints
   * - Check precipitation amount validation
   * - Ensure environmental data quality
   */
  describe('Weather Conditions Validation', () => {
    /**
     * __Validate Temperature Range Constraints
     * Acceptance case (scenario)
     * - Test minimum temperature boundary (-50°C)
     * - Test maximum temperature boundary (60°C)
     * - Verify extreme values are rejected
     */
    it('should validate temperature range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          temperature: -60,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.temperature']).toBeDefined();
    });

    /**
     * __Validate Maximum Temperature Constraint
     * Acceptance case (scenario)
     * - Test upper temperature boundary (60°C)
     * - Verify overheating conditions are flagged
     * - Ensure temperature data accuracy
     */
    it('should validate temperature max range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          temperature: 70,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.temperature']).toBeDefined();
    });

    /**
     * __Validate Humidity Range Constraints
     * Acceptance case (scenario)
     * - Test minimum humidity boundary (0%)
     * - Verify negative humidity is rejected
     * - Ensure humidity data validity
     */
    it('should validate humidity range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          humidity: -5,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.humidity']).toBeDefined();
    });

    /**
     * __Validate Maximum Humidity Constraint
     * Acceptance case (scenario)
     * - Test upper humidity boundary (100%)
     * - Verify excessive humidity is flagged
     * - Ensure humidity measurement accuracy
     */
    it('should validate humidity max range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          humidity: 105,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.humidity']).toBeDefined();
    });

    /**
     * __Validate Wind Speed Range Constraints
     * Acceptance case (scenario)
     * - Test minimum wind speed boundary (0)
     * - Verify negative wind speeds are rejected
     * - Ensure wind measurement validity
     */
    it('should validate windSpeed range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          windSpeed: -5,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.windSpeed']).toBeDefined();
    });

    /**
     * __Validate Maximum Wind Speed Constraint
     * Acceptance case (scenario)
     * - Test upper wind speed boundary (100)
     * - Verify extreme wind conditions are flagged
     * - Ensure wind measurement accuracy
     */
    it('should validate windSpeed max range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          windSpeed: 105,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.windSpeed']).toBeDefined();
    });

    /**
     * __Validate Precipitation Range Constraints
     * Acceptance case (scenario)
     * - Test minimum precipitation boundary (0)
     * - Verify negative precipitation is rejected
     * - Ensure precipitation data validity
     */
    it('should validate precipitation min range in weather conditions', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        weatherConditions: {
          precipitation: -1,
        },
      };

      const waterUsage = new WaterUsageModel(waterUsageData);

      let error: any;
      try {
        await waterUsage.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.precipitation']).toBeDefined();
    });
  });

  /**
   * __Date Validation
   * Acceptance case (scenario)
   * - Test date range validation for irrigation periods
   * - Verify chronological order of start and end dates
   * - Handle edge cases with identical timestamps
   * - Ensure temporal data consistency
   */
  describe('Date Validation', () => {
    /**
     * __Validate Date Range Chronology
     * Acceptance case (scenario)
     * - Create water usage with start date before end date
     * - Verify temporal sequence is maintained
     * - Ensure irrigation period is properly defined
     */
    it('should handle valid date ranges', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        startDate: new Date('2023-06-15T08:00:00Z'),
        endDate: new Date('2023-06-15T10:00:00Z'),
      };

      const waterUsage = new WaterUsageModel(waterUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.startDate.getTime()).toBeLessThan(savedWaterUsage.endDate.getTime());
    });

    /**
     * __Handle Identical Start and End Dates
     * Acceptance case (scenario)
     * - Create water usage with same start and end date
     * - Verify zero-duration periods are handled
     * - Test edge case of instantaneous irrigation
     */
    it('should handle same start and end date', async () => {
      const sameDate = new Date('2023-06-15T08:00:00Z');
      const waterUsageData = {
        ...validWaterUsageData,
        startDate: sameDate,
        endDate: sameDate,
      };

      const waterUsage = new WaterUsageModel(waterUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.startDate).toEqual(savedWaterUsage.endDate);
    });
  });

  /**
   * __Business Logic Validation
   * Acceptance case (scenario)
   * - Test water usage calculation consistency
   * - Verify mathematical relationships between fields
   * - Handle zero-value edge cases
   * - Validate irrigation efficiency calculations
   */
  describe('Business Logic Validation', () => {
    /**
     * __Validate Water Usage Calculations
     * Acceptance case (scenario)
     * - Create water usage with consistent mathematical relationships
     * - Verify waterUsedLiters = durationMinutes × averageFlowRate
     * - Ensure calculation accuracy for billing and monitoring
     */
    it('should calculate consistent water usage data', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        waterUsedLiters: 150,
        durationMinutes: 30,
        averageFlowRate: 5,
      };

      const waterUsage = new WaterUsageModel(waterUsageData);
      const savedWaterUsage = await waterUsage.save();

      const expectedWaterUsage = savedWaterUsage.durationMinutes * savedWaterUsage.averageFlowRate;
      expect(Math.abs(savedWaterUsage.waterUsedLiters - expectedWaterUsage)).toBeLessThan(0.01);
    });

    /**
     * __Handle Zero Duration Edge Cases
     * Acceptance case (scenario)
     * - Create water usage with zero duration
     * - Verify system handles zero-value measurements
     * - Test edge case of maintenance or testing scenarios
     */
    it('should handle zero duration gracefully', async () => {
      const waterUsageData = {
        ...validWaterUsageData,
        durationMinutes: 0,
        waterUsedLiters: 0,
        averageFlowRate: 0,
      };

      const waterUsage = new WaterUsageModel(waterUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.durationMinutes).toBe(0);
      expect(savedWaterUsage.waterUsedLiters).toBe(0);
      expect(savedWaterUsage.averageFlowRate).toBe(0);
    });
  });

  /**
   * __Default Values
   * Acceptance case (scenario)
   * - Test automatic timestamp generation
   * - Verify createdAt and updatedAt are properly set
   * - Validate timestamp consistency on creation
   * - Test timestamp updates on document modification
   */
  describe('Default Values', () => {
    /**
     * __Verify Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create water usage record without explicit timestamps
     * - Verify createdAt and updatedAt are automatically generated
     * - Ensure timestamps are identical on creation
     */
    it('should set timestamps', async () => {
      const waterUsage = new WaterUsageModel(validWaterUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.createdAt).toBeInstanceOf(Date);
      expect(savedWaterUsage.updatedAt).toBeInstanceOf(Date);
      expect(savedWaterUsage.createdAt.getTime()).toBe(savedWaterUsage.updatedAt.getTime());
    });

    /**
     * __Verify Timestamp Updates on Modification
     * Acceptance case (scenario)
     * - Update existing water usage record
     * - Verify updatedAt timestamp is modified
     * - Ensure createdAt remains unchanged
     */
    it('should update updatedAt on save', async () => {
      const waterUsage = new WaterUsageModel(validWaterUsageData);
      const savedWaterUsage = await waterUsage.save();

      const originalUpdatedAt = savedWaterUsage.updatedAt.getTime();

      await new Promise((resolve) => setTimeout(resolve, 10));

      savedWaterUsage.waterUsedLiters = 200;
      await savedWaterUsage.save();

      expect(savedWaterUsage.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);
    });
  });

  /**
   * __Data Integrity
   * Acceptance case (scenario)
   * - Test data consistency across multiple save operations
   * - Verify field relationships are maintained
   * - Handle large value scenarios
   * - Ensure data persistence and retrieval accuracy
   */
  describe('Data Integrity', () => {
    /**
     * __Verify Data Consistency Across Saves
     * Acceptance case (scenario)
     * - Create and save water usage record
     * - Modify and save again
     * - Verify all data relationships are maintained
     */
    it('should maintain data consistency across saves', async () => {
      const waterUsage = new WaterUsageModel(validWaterUsageWithWeather);
      const savedWaterUsage = await waterUsage.save();

      savedWaterUsage.waterUsedLiters = 300;
      const reSavedWaterUsage = await savedWaterUsage.save();

      expect(reSavedWaterUsage.waterUsedLiters).toBe(300);
      expect(reSavedWaterUsage.weatherConditions!.temperature).toBe(25);
      expect(reSavedWaterUsage.createdAt.getTime()).toBe(savedWaterUsage.createdAt.getTime());
    });

    /**
     * __Handle Large Water Usage Values
     * Acceptance case (scenario)
     * - Create water usage with maximum realistic values
     * - Verify system handles large-scale irrigation data
     * - Test boundary conditions for enterprise scenarios
     */
    it('should handle large water usage values', async () => {
      const largeUsageData = {
        ...validWaterUsageData,
        waterUsedLiters: 999999.99,
        durationMinutes: 1440,
        averageFlowRate: 694.44,
      };

      const waterUsage = new WaterUsageModel(largeUsageData);
      const savedWaterUsage = await waterUsage.save();

      expect(savedWaterUsage.waterUsedLiters).toBe(999999.99);
      expect(savedWaterUsage.durationMinutes).toBe(1440);
      expect(savedWaterUsage.averageFlowRate).toBe(694.44);
    });
  });
});
