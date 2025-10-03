/**
 * __Schedule Model Unit Tests
 * Acceptance case (scenario)
 * - Create irrigation schedules with valid timing data
 * - Validate required field constraints
 * - Test schedule type constraints and validation
 * - Verify time format validation for start times
 * - Handle duration constraints for irrigation periods
 * - Test day-of-week validation for calendar schedules
 * - Validate weather condition parameters
 * - Test sensor threshold configurations
 * - Verify default enabled status
 * - Handle schedule management operations
 * - Test edge cases with various scheduling scenarios
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import ScheduleModel from '../../src/Models/Schedule.model';

/**
 * __Schedule Model Unit Tests
 * Acceptance case (scenario)
 * - Create irrigation schedules with valid timing data
 * - Validate required field constraints
 * - Test schedule type constraints and validation
 * - Verify time format validation for start times
 * - Handle duration constraints for irrigation periods
 * - Test day-of-week validation for calendar schedules
 * - Validate weather condition parameters
 * - Test sensor threshold configurations
 * - Verify default enabled status
 * - Handle schedule management operations
 * - Test edge cases with various scheduling scenarios
 */
describe('Schedule Model', () => {
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
    await ScheduleModel.deleteMany({});
  });

  const validScheduleData = {
    zoneId: '507f1f77bcf86cd799439011',
    type: 'calendar' as const,
    startTime: '08:00',
    duration: 30,
    enabled: true,
  };

  const validScheduleWithDays = {
    ...validScheduleData,
    days: [1, 3, 5],
  };

  const validWeatherSchedule = {
    zoneId: '507f1f77bcf86cd799439011',
    type: 'weather' as const,
    startTime: '06:00',
    duration: 45,
    enabled: true,
    weatherConditions: {
      minTemperature: 15,
      maxTemperature: 30,
      noRain: true,
    },
  };

  /**
   * __Valid Schedule Creation
   * Acceptance case (scenario)
   * - Create schedules with different types (calendar, weather, sensor)
   * - Verify persistence and data integrity
   * - Ensure correct schema mapping
   */
  describe('Valid Schedule Creation', () => {
    /**
     * __Create Calendar Schedule
     * Acceptance case (scenario)
     * - Create a basic calendar schedule
     * - Verify saved document contains valid values
     * - Ensure timestamps are generated
     */
    it('should create a basic calendar schedule', async () => {
      const schedule = new ScheduleModel(validScheduleData);
      const savedSchedule = await schedule.save();

      expect(savedSchedule._id).toBeDefined();
      expect(savedSchedule.zoneId).toBe(validScheduleData.zoneId);
      expect(savedSchedule.type).toBe(validScheduleData.type);
      expect(savedSchedule.startTime).toBe(validScheduleData.startTime);
      expect(savedSchedule.duration).toBe(validScheduleData.duration);
      expect(savedSchedule.enabled).toBe(validScheduleData.enabled);
      expect(savedSchedule.createdAt).toBeDefined();
      expect(savedSchedule.updatedAt).toBeDefined();
    });

    /**
     * __Create Calendar Schedule with Days
     * Acceptance case (scenario)
     * - Save a schedule with specific day values
     * - Verify days array matches provided values
     */
    it('should create a schedule with specific days', async () => {
      const schedule = new ScheduleModel(validScheduleWithDays);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.days).toEqual([1, 3, 5]);
    });

    /**
     * __Create Weather-based Schedule
     * Acceptance case (scenario)
     * - Create schedule with weather conditions
     * - Verify min/max temperature and noRain fields
     */
    it('should create a weather-based schedule', async () => {
      const schedule = new ScheduleModel(validWeatherSchedule);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.weatherConditions).toBeDefined();
      expect(savedSchedule.weatherConditions!.minTemperature).toBe(15);
      expect(savedSchedule.weatherConditions!.maxTemperature).toBe(30);
      expect(savedSchedule.weatherConditions!.noRain).toBe(true);
    });

    /**
     * __Create Sensor-based Schedule
     * Acceptance case (scenario)
     * - Create schedule with soil moisture and temperature thresholds
     * - Verify sensorThresholds object is persisted correctly
     */
    it('should create a sensor-based schedule', async () => {
      const sensorSchedule = {
        zoneId: '507f1f77bcf86cd799439011',
        type: 'sensor' as const,
        startTime: '07:00',
        duration: 60,
        enabled: true,
        sensorThresholds: {
          soilMoisture: 40,
          temperature: 20,
        },
      };

      const schedule = new ScheduleModel(sensorSchedule);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.sensorThresholds).toBeDefined();
      expect(savedSchedule.sensorThresholds!.soilMoisture).toBe(40);
      expect(savedSchedule.sensorThresholds!.temperature).toBe(20);
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure schedule integrity by enforcing field requirements
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required zoneId Field
     * Acceptance case (scenario)
     * - Attempt to save schedule without zoneId
     * - Verify validation error is thrown
     * - Ensure schedule zone association
     */
    it('should require zoneId field', async () => {
      const scheduleData = { ...validScheduleData, zoneId: undefined };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.zoneId).toBeDefined();
    });

    /**
     * __Validate Required type Field
     * Acceptance case (scenario)
     * - Attempt to save schedule without type
     * - Verify validation error is thrown
     * - Ensure schedule type classification
     */
    it('should require type field', async () => {
      const scheduleData = { ...validScheduleData, type: undefined };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.type).toBeDefined();
    });

    /**
     * __Validate Required startTime Field
     * Acceptance case (scenario)
     * - Attempt to save schedule without startTime
     * - Verify validation error is thrown
     * - Ensure irrigation timing specification
     */
    it('should require startTime field', async () => {
      const scheduleData = { ...validScheduleData, startTime: undefined };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.startTime).toBeDefined();
    });

    /**
     * __Validate Required duration Field
     * Acceptance case (scenario)
     * - Attempt to save schedule without duration
     * - Verify validation error is thrown
     * - Ensure irrigation duration specification
     */
    it('should require duration field', async () => {
      const scheduleData = { ...validScheduleData, duration: undefined };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
    });
  });
  /**
   * __Default Values__
   * Acceptance case (scenario)
   * - Ensure that default fields are properly set
   * - Validate enabled defaults to true when not provided
   */
  describe('Default Values', () => {
    /**
     * __Enabled Default True__
     * Acceptance case
     * - Create schedule without enabled field
     * - Verify enabled defaults to true
     */
    it('should set default enabled to true', async () => {
      const scheduleData = { ...validScheduleData, enabled: undefined };

      const schedule = new ScheduleModel(scheduleData);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.enabled).toBe(true);
    });
  });

  /**
   * __Field Constraints__
   * Acceptance case (scenario)
   * - Enforce duration minimum constraint
   * - Enforce duration maximum constraint
   * - Reject invalid durations outside defined range
   */
  describe('Field Constraints', () => {
    /**
     * __Duration Minimum Constraint__
     * Acceptance case
     * - Attempt to save duration below minimum
     * - Expect validation error on duration
     */
    it('should enforce duration min constraint', async () => {
      const scheduleData = { ...validScheduleData, duration: 0 };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
    });

    /**
     * __Duration Maximum Constraint__
     * Acceptance case
     * - Attempt to save duration above maximum
     * - Expect validation error on duration
     */
    it('should enforce duration max constraint', async () => {
      const scheduleData = { ...validScheduleData, duration: 1500 };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.duration).toBeDefined();
    });
  });

  /**
   * __Enum Validation__
   * Acceptance case (scenario)
   * - Reject values not part of type enum
   * - Ensure schedule type matches allowed set
   */
  describe('Enum Validation', () => {
    /**
     * __Type Enum Constraint__
     * Acceptance case
     * - Attempt to save invalid type value
     * - Expect validation error on type
     */
    it('should enforce type enum constraint', async () => {
      const scheduleData = { ...validScheduleData, type: 'invalid_type' };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.type).toBeDefined();
    });
  });

  /**
   * __Days Validation__
   * Acceptance case (scenario)
   * - Reject days outside [0,6] range
   * - Allow valid days array
   * - Allow empty days for interval schedules
   */
  describe('Days Validation', () => {
    /**
     * __Invalid Days Range__
     * Acceptance case
     * - Attempt to save days outside range [-1,7]
     * - Expect validation error on days
     */
    it('should validate days are within valid range', async () => {
      const scheduleData = { ...validScheduleData, days: [-1, 7] };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.days).toBeDefined();
    });

    /**
     * __Valid Days Range__
     * Acceptance case
     * - Save with valid days [0,6]
     * - Expect persisted correctly
     */
    it('should allow valid days range', async () => {
      const scheduleData = { ...validScheduleData, days: [0, 6] };

      const schedule = new ScheduleModel(scheduleData);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.days).toEqual([0, 6]);
    });

    /**
     * __Empty Days for Interval__
     * Acceptance case
     * - Create interval schedule with empty days array
     * - Expect empty array persisted
     */
    it('should allow empty days array for interval schedules', async () => {
      const intervalSchedule = {
        zoneId: '507f1f77bcf86cd799439011',
        type: 'interval' as const,
        startTime: '08:00',
        duration: 30,
        enabled: true,
        days: [],
      };

      const schedule = new ScheduleModel(intervalSchedule);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.days).toEqual([]);
    });
  });

  /**
   * __Start Time Validation
   * Acceptance case (scenario)
   * - Test start time format validation
   * - Verify valid time format acceptance
   * - Handle time format constraints
   * - Ensure proper irrigation timing
   */
  describe('Start Time Validation', () => {
    /**
     * __Validate Start Time Format
     * Acceptance case (scenario)
     * - Test invalid time format rejection
     * - Verify 24-hour time format validation
     * - Ensure proper time specification
     */
    it('should validate startTime format', async () => {
      const scheduleData = { ...validScheduleData, startTime: '25:00' };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.startTime).toBeDefined();
    });

    /**
     * __Accept Valid Time Formats
     * Acceptance case (scenario)
     * - Test multiple valid time formats
     * - Verify 24-hour format acceptance
     * - Ensure flexible time specification
     */
    it('should accept valid time formats', async () => {
      const validTimes = ['00:00', '12:30', '23:59'];

      for (const time of validTimes) {
        const scheduleData = { ...validScheduleData, startTime: time };
        const schedule = new ScheduleModel(scheduleData);
        const savedSchedule = await schedule.save();

        expect(savedSchedule.startTime).toBe(time);
      }
    });
  });

  /**
   * __Weather Conditions Validation
   * Acceptance case (scenario)
   * - Test weather condition constraints for schedules
   * - Verify temperature, humidity, and wind speed ranges
   * - Validate environmental condition parameters
   * - Ensure weather-based irrigation logic
   */
  describe('Weather Conditions Validation', () => {
    /**
     * __Validate Temperature Ranges
     * Acceptance case (scenario)
     * - Test minimum and maximum temperature boundaries
     * - Verify extreme temperature values are rejected
     * - Ensure safe irrigation temperature ranges
     */
    it('should validate temperature ranges', async () => {
      const scheduleData = {
        ...validWeatherSchedule,
        weatherConditions: {
          minTemperature: -100,
          maxTemperature: 100,
        },
      };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.minTemperature']).toBeDefined();
      expect(error.errors['weatherConditions.maxTemperature']).toBeDefined();
    });

    /**
     * __Validate Humidity Range
     * Acceptance case (scenario)
     * - Test maximum humidity boundary (100%)
     * - Verify excessive humidity values are rejected
     * - Ensure realistic humidity constraints
     */
    it('should validate humidity range', async () => {
      const scheduleData = {
        ...validWeatherSchedule,
        weatherConditions: {
          maxHumidity: 150,
        },
      };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.maxHumidity']).toBeDefined();
    });

    /**
     * __Validate Wind Speed Range
     * Acceptance case (scenario)
     * - Test minimum wind speed boundary (0 km/h)
     * - Verify negative wind speed values are rejected
     * - Ensure positive wind speed measurements
     */
    it('should validate wind speed range', async () => {
      const scheduleData = {
        ...validWeatherSchedule,
        weatherConditions: {
          maxWindSpeed: -1,
        },
      };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['weatherConditions.maxWindSpeed']).toBeDefined();
    });
  });

  /**
   * __Sensor Thresholds Validation
   * Acceptance case (scenario)
   * - Test sensor threshold constraints for sensor-based schedules
   * - Verify soil moisture, temperature, and humidity ranges
   * - Validate sensor condition parameters
   * - Ensure sensor-based irrigation logic
   */
  describe('Sensor Thresholds Validation', () => {
    /**
     * __Validate Soil Moisture Range
     * Acceptance case (scenario)
     * - Test maximum soil moisture boundary (100%)
     * - Verify unrealistic moisture values are rejected
     * - Ensure realistic soil moisture constraints
     */
    it('should validate soil moisture range', async () => {
      const scheduleData = {
        zoneId: '507f1f77bcf86cd799439011',
        type: 'sensor' as const,
        startTime: '07:00',
        duration: 60,
        enabled: true,
        sensorThresholds: {
          soilMoisture: 150,
        },
      };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['sensorThresholds.soilMoisture']).toBeDefined();
    });

    /**
     * __Validate Sensor Temperature Range
     * Acceptance case (scenario)
     * - Test minimum temperature boundary for sensors
     * - Verify extreme temperature values are rejected
     * - Ensure sensor temperature monitoring accuracy
     */
    it('should validate sensor temperature range', async () => {
      const scheduleData = {
        zoneId: '507f1f77bcf86cd799439011',
        type: 'sensor' as const,
        startTime: '07:00',
        duration: 60,
        enabled: true,
        sensorThresholds: {
          temperature: -100,
        },
      };

      const schedule = new ScheduleModel(scheduleData);

      let error: any;
      try {
        await schedule.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['sensorThresholds.temperature']).toBeDefined();
    });
  });

  /**
   * __Default Values
   * Acceptance case (scenario)
   * - Test automatic default value assignment
   * - Verify default enabled status is set to true
   * - Validate automatic timestamp generation
   * - Ensure proper default behavior for new schedules
   */
  describe('Default Values', () => {
    /**
     * __Verify Default Enabled Status Assignment
     * Acceptance case (scenario)
     * - Create schedule without explicit enabled status
     * - Verify default enabled status is automatically set
     * - Ensure new schedules are active by default
     */
    it('should set default enabled to true', async () => {
      const scheduleData = { ...validScheduleData, enabled: undefined };

      const schedule = new ScheduleModel(scheduleData);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.enabled).toBe(true);
    });

    /**
     * __Verify Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create schedule without explicit timestamps
     * - Verify createdAt and updatedAt are generated
     * - Ensure timestamp consistency on creation
     */
    it('should set timestamps', async () => {
      const schedule = new ScheduleModel(validScheduleData);
      const savedSchedule = await schedule.save();

      expect(savedSchedule.createdAt).toBeInstanceOf(Date);
      expect(savedSchedule.updatedAt).toBeInstanceOf(Date);
      expect(savedSchedule.createdAt.getTime()).toBe(savedSchedule.updatedAt.getTime());
    });
  });
});
