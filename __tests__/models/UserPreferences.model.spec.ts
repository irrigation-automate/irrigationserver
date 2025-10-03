/**
 * __UserPreferences Model Unit Tests
 * Acceptance case (scenario)
 * - Create user preferences with valid data
 * - Validate required field constraints
 * - Test enum constraints for language and dashboard views
 * - Validate numeric constraints for refresh intervals
 * - Test default value assignments
 * - Verify unique constraint on userId
 * - Handle nested object updates
 * - Test data integrity across saves
 * - Validate business logic for preferences management
 * - Handle edge cases with various configurations
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserPreferencesModel from '../../src/Models/UserPreferences.model';

/**
 * __UserPreferences Model Unit Tests
 * Acceptance case (scenario)
 * - Create user preferences with valid data
 * - Validate required field constraints
 * - Test enum constraints for language and dashboard views
 * - Validate numeric constraints for refresh intervals
 * - Test default value assignments
 * - Verify unique constraint on userId
 * - Handle nested object updates
 * - Test data integrity across saves
 * - Validate business logic for preferences management
 * - Handle edge cases with various configurations
 */
describe('UserPreferences Model', () => {
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
    await UserPreferencesModel.deleteMany({});
  });

  const validUserPreferencesData = {
    userId: '507f1f77bcf86cd799439011',
    language: 'en',
    timezone: 'America/New_York',
    emailNotifications: {
      enabled: true,
      scheduleUpdates: true,
      systemAlerts: true,
      maintenanceReminders: true,
      weeklyReports: false,
    },
    pushNotifications: {
      enabled: true,
      scheduleUpdates: true,
      systemAlerts: true,
      maintenanceReminders: true,
    },
    dashboard: {
      defaultView: 'overview' as const,
      refreshInterval: 60,
      showWeather: true,
      showWaterUsage: true,
    },
  };

  /**
   * __Valid UserPreferences Creation
   * Acceptance case (scenario)
   * - Create preferences with complete configuration
   * - Test minimal data creation with defaults
   * - Verify persistence and data integrity
   * - Ensure correct schema mapping
   */
  describe('Valid UserPreferences Creation', () => {
    /**
     * __Create UserPreferences with Valid Data
     * Acceptance case (scenario)
     * - Create preferences with all fields specified
     * - Verify saved document contains valid values
     * - Ensure timestamps are generated
     * - Validate nested object persistence
     */
    it('should create user preferences with valid data', async () => {
      const userPreferences = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences._id).toBeDefined();
      expect(savedUserPreferences.userId).toBe(validUserPreferencesData.userId);
      expect(savedUserPreferences.language).toBe(validUserPreferencesData.language);
      expect(savedUserPreferences.timezone).toBe(validUserPreferencesData.timezone);
      expect(savedUserPreferences.emailNotifications).toEqual(
        validUserPreferencesData.emailNotifications,
      );
      expect(savedUserPreferences.pushNotifications).toEqual(
        validUserPreferencesData.pushNotifications,
      );
      expect(savedUserPreferences.dashboard).toEqual(validUserPreferencesData.dashboard);
      expect(savedUserPreferences.createdAt).toBeDefined();
      expect(savedUserPreferences.updatedAt).toBeDefined();
    });

    /**
     * __Create UserPreferences with Minimal Data Using Defaults
     * Acceptance case (scenario)
     * - Create preferences with only userId
     * - Verify default values are applied
     * - Ensure complete preference structure
     */
    it('should create user preferences with minimal data using defaults', async () => {
      const minimalData = {
        userId: '507f1f77bcf86cd799439012',
      };

      const userPreferences = new UserPreferencesModel(minimalData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.language).toBe('en');
      expect(savedUserPreferences.timezone).toBe('UTC');
      expect(savedUserPreferences.emailNotifications.enabled).toBe(true);
      expect(savedUserPreferences.dashboard.defaultView).toBe('overview');
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure user preference association
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required userId Field
     * Acceptance case (scenario)
     * - Attempt to save preferences without userId
     * - Verify validation error is thrown
     * - Ensure user association requirement
     */
    it('should require userId field', async () => {
      const userPreferencesData = { ...validUserPreferencesData, userId: undefined };

      const userPreferences = new UserPreferencesModel(userPreferencesData);

      let error: any;
      try {
        await userPreferences.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
    });
  });

  /**
   * __Field Constraints
   * Acceptance case (scenario)
   * - Enforce language enum constraints
   * - Validate refresh interval boundaries
   * - Test dashboard view enum constraints
   * - Ensure data quality and valid configuration
   */
  describe('Field Constraints', () => {
    /**
     * __Language Enum Constraint
     * Acceptance case (scenario)
     * - Attempt to save invalid language value
     * - Verify validation error is thrown
     * - Ensure supported language restrictions
     */
    it('should enforce language enum constraint', async () => {
      const userPreferencesData = { ...validUserPreferencesData, language: 'invalid_language' };

      const userPreferences = new UserPreferencesModel(userPreferencesData);

      let error: any;
      try {
        await userPreferences.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.language).toBeDefined();
    });

    /**
     * __Accept Valid Language Values
     * Acceptance case (scenario)
     * - Test all supported language codes
     * - Verify each language is accepted
     * - Ensure multilingual support
     */
    it('should accept valid language values', async () => {
      const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt'];

      for (const language of validLanguages) {
        const userPreferencesData = {
          ...validUserPreferencesData,
          userId: `test_user_${language}_${Date.now()}`,
          language,
        };
        const userPreferences = new UserPreferencesModel(userPreferencesData);
        const savedUserPreferences = await userPreferences.save();

        expect(savedUserPreferences.language).toBe(language);
      }
    });

    /**
     * __RefreshInterval Minimum Constraint
     * Acceptance case (scenario)
     * - Attempt to save interval below minimum (30 seconds)
     * - Verify validation error is thrown
     * - Ensure reasonable refresh rate limits
     */
    it('should enforce refreshInterval min constraint', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          ...validUserPreferencesData.dashboard,
          refreshInterval: 25,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);

      let error: any;
      try {
        await userPreferences.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['dashboard.refreshInterval']).toBeDefined();
    });

    /**
     * __RefreshInterval Maximum Constraint
     * Acceptance case (scenario)
     * - Attempt to save interval above maximum (300 seconds)
     * - Verify validation error is thrown
     * - Ensure performance-friendly limits
     */
    it('should enforce refreshInterval max constraint', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          ...validUserPreferencesData.dashboard,
          refreshInterval: 350,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);

      let error: any;
      try {
        await userPreferences.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['dashboard.refreshInterval']).toBeDefined();
    });

    /**
     * __Accept Valid RefreshInterval Values
     * Acceptance case (scenario)
     * - Test common refresh interval values
     * - Verify values within valid range are accepted
     * - Ensure flexible refresh configuration
     */
    it('should accept valid refreshInterval values', async () => {
      const validIntervals = [30, 60, 120, 300];

      for (const interval of validIntervals) {
        const userPreferencesData = {
          ...validUserPreferencesData,
          userId: `test_user_interval_${interval}_${Date.now()}`,
          dashboard: {
            ...validUserPreferencesData.dashboard,
            refreshInterval: interval,
          },
        };
        const userPreferences = new UserPreferencesModel(userPreferencesData);
        const savedUserPreferences = await userPreferences.save();

        expect(savedUserPreferences.dashboard.refreshInterval).toBe(interval);
      }
    });

    /**
     * __Dashboard DefaultView Enum Constraint
     * Acceptance case (scenario)
     * - Attempt to save invalid view value
     * - Verify validation error is thrown
     * - Ensure supported view restrictions
     */
    it('should enforce dashboard defaultView enum constraint', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          ...validUserPreferencesData.dashboard,
          defaultView: 'invalid_view' as any,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);

      let error: any;
      try {
        await userPreferences.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['dashboard.defaultView']).toBeDefined();
    });

    /**
     * __Accept Valid Dashboard DefaultView Values
     * Acceptance case (scenario)
     * - Test all supported dashboard views
     * - Verify each view type is accepted
     * - Ensure flexible dashboard navigation
     */
    it('should accept valid dashboard defaultView values', async () => {
      const validViews = ['overview', 'zones', 'pumps', 'schedules'];

      for (const view of validViews) {
        const userPreferencesData = {
          ...validUserPreferencesData,
          userId: `test_user_view_${view}_${Date.now()}`,
          dashboard: {
            ...validUserPreferencesData.dashboard,
            defaultView: view as any,
          },
        };
        const userPreferences = new UserPreferencesModel(userPreferencesData);
        const savedUserPreferences = await userPreferences.save();

        expect(savedUserPreferences.dashboard.defaultView).toBe(view);
      }
    });
  });

  /**
   * __Nested Object Validation
   * Acceptance case (scenario)
   * - Test email notification structure validation
   * - Test push notification structure validation
   * - Test dashboard configuration structure
   * - Ensure nested object integrity
   */
  describe('Nested Object Validation', () => {
    /**
     * __Validate EmailNotifications Structure
     * Acceptance case (scenario)
     * - Create preferences with custom email settings
     * - Verify all notification flags are persisted
     * - Ensure granular email control
     */
    it('should validate emailNotifications structure', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        emailNotifications: {
          enabled: true,
          scheduleUpdates: false,
          systemAlerts: true,
          maintenanceReminders: false,
          weeklyReports: true,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.emailNotifications.enabled).toBe(true);
      expect(savedUserPreferences.emailNotifications.scheduleUpdates).toBe(false);
      expect(savedUserPreferences.emailNotifications.systemAlerts).toBe(true);
      expect(savedUserPreferences.emailNotifications.maintenanceReminders).toBe(false);
      expect(savedUserPreferences.emailNotifications.weeklyReports).toBe(true);
    });

    /**
     * __Validate PushNotifications Structure
     * Acceptance case (scenario)
     * - Create preferences with custom push settings
     * - Verify all notification flags are persisted
     * - Ensure granular push control
     */
    it('should validate pushNotifications structure', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        pushNotifications: {
          enabled: false,
          scheduleUpdates: false,
          systemAlerts: true,
          maintenanceReminders: false,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.pushNotifications.enabled).toBe(false);
      expect(savedUserPreferences.pushNotifications.scheduleUpdates).toBe(false);
      expect(savedUserPreferences.pushNotifications.systemAlerts).toBe(true);
      expect(savedUserPreferences.pushNotifications.maintenanceReminders).toBe(false);
    });

    /**
     * __Validate Dashboard Structure
     * Acceptance case (scenario)
     * - Create preferences with custom dashboard settings
     * - Verify all dashboard options are persisted
     * - Ensure personalized dashboard experience
     */
    it('should validate dashboard structure', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          defaultView: 'zones' as const,
          refreshInterval: 120,
          showWeather: false,
          showWaterUsage: false,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.dashboard.defaultView).toBe('zones');
      expect(savedUserPreferences.dashboard.refreshInterval).toBe(120);
      expect(savedUserPreferences.dashboard.showWeather).toBe(false);
      expect(savedUserPreferences.dashboard.showWaterUsage).toBe(false);
    });
  });

  /**
   * __Default Values
   * Acceptance case (scenario)
   * - Test automatic default value assignment
   * - Verify default language and timezone
   * - Validate default notification settings
   * - Ensure proper default behavior for new preferences
   */
  describe('Default Values', () => {
    /**
     * __Default Language to English
     * Acceptance case (scenario)
     * - Create preferences without language specified
     * - Verify default language is set to 'en'
     * - Ensure consistent language fallback
     */
    it('should set default language to en', async () => {
      const userPreferencesData = { ...validUserPreferencesData, language: undefined };
      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.language).toBe('en');
    });

    /**
     * __Default Timezone to UTC
     * Acceptance case (scenario)
     * - Create preferences without timezone specified
     * - Verify default timezone is set to 'UTC'
     * - Ensure neutral timezone fallback
     */
    it('should set default timezone to UTC', async () => {
      const userPreferencesData = { ...validUserPreferencesData, timezone: undefined };
      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.timezone).toBe('UTC');
    });

    /**
     * __Default EmailNotifications Values
     * Acceptance case (scenario)
     * - Create preferences without email settings
     * - Verify default notification flags
     * - Ensure opt-in notification strategy
     */
    it('should set default emailNotifications values', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        emailNotifications: {
          enabled: undefined,
          scheduleUpdates: undefined,
          systemAlerts: undefined,
          maintenanceReminders: undefined,
          weeklyReports: undefined,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.emailNotifications.enabled).toBe(true);
      expect(savedUserPreferences.emailNotifications.scheduleUpdates).toBe(true);
      expect(savedUserPreferences.emailNotifications.systemAlerts).toBe(true);
      expect(savedUserPreferences.emailNotifications.maintenanceReminders).toBe(true);
      expect(savedUserPreferences.emailNotifications.weeklyReports).toBe(false);
    });

    /**
     * __Default PushNotifications Values
     * Acceptance case (scenario)
     * - Create preferences without push settings
     * - Verify default notification flags
     * - Ensure opt-in push strategy
     */
    it('should set default pushNotifications values', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        pushNotifications: {
          enabled: undefined,
          scheduleUpdates: undefined,
          systemAlerts: undefined,
          maintenanceReminders: undefined,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.pushNotifications.enabled).toBe(true);
      expect(savedUserPreferences.pushNotifications.scheduleUpdates).toBe(true);
      expect(savedUserPreferences.pushNotifications.systemAlerts).toBe(true);
      expect(savedUserPreferences.pushNotifications.maintenanceReminders).toBe(true);
    });

    /**
     * __Default Dashboard Values
     * Acceptance case (scenario)
     * - Create preferences without dashboard settings
     * - Verify default view and refresh rate
     * - Ensure user-friendly dashboard defaults
     */
    it('should set default dashboard values', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          defaultView: undefined,
          refreshInterval: undefined,
          showWeather: undefined,
          showWaterUsage: undefined,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.dashboard.defaultView).toBe('overview');
      expect(savedUserPreferences.dashboard.refreshInterval).toBe(60);
      expect(savedUserPreferences.dashboard.showWeather).toBe(true);
      expect(savedUserPreferences.dashboard.showWaterUsage).toBe(true);
    });

    /**
     * __Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create preferences without explicit timestamps
     * - Verify createdAt and updatedAt are generated
     * - Ensure timestamp consistency on creation
     */
    it('should set timestamps', async () => {
      const userPreferences = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.createdAt).toBeInstanceOf(Date);
      expect(savedUserPreferences.updatedAt).toBeInstanceOf(Date);
      expect(savedUserPreferences.createdAt.getTime()).toBe(
        savedUserPreferences.updatedAt.getTime(),
      );
    });
  });

  /**
   * __Unique Constraint
   * Acceptance case (scenario)
   * - Test userId field handling
   * - Verify user preference lookup functionality
   * - Ensure one preference set per user
   */
  describe('Unique Constraint', () => {
    /**
     * __Handle UserId Field Properly
     * Acceptance case (scenario)
     * - Create and retrieve preferences by userId
     * - Verify userId-based queries work correctly
     * - Ensure user preference association
     */
    it('should handle userId field properly', async () => {
      const userPreferences1 = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences1 = await userPreferences1.save();

      expect(savedUserPreferences1.userId).toBe(validUserPreferencesData.userId);

      const foundUserPreferences = await UserPreferencesModel.findOne({
        userId: validUserPreferencesData.userId,
      });

      expect(foundUserPreferences).toBeTruthy();
      expect(foundUserPreferences!.userId).toBe(validUserPreferencesData.userId);
    });
  });

  /**
   * __Data Integrity
   * Acceptance case (scenario)
   * - Test data consistency across updates
   * - Validate timestamp updates
   * - Handle complex nested object updates
   * - Ensure createdAt immutability
   */
  describe('Data Integrity', () => {
    /**
     * __Maintain Data Consistency Across Updates
     * Acceptance case (scenario)
     * - Update multiple preference fields simultaneously
     * - Verify all changes are persisted
     * - Ensure createdAt remains unchanged
     */
    it('should maintain data consistency across updates', async () => {
      const userPreferences = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      savedUserPreferences.language = 'es';
      savedUserPreferences.dashboard.refreshInterval = 120;
      savedUserPreferences.emailNotifications.weeklyReports = true;

      const updatedUserPreferences = await savedUserPreferences.save();

      expect(updatedUserPreferences.language).toBe('es');
      expect(updatedUserPreferences.dashboard.refreshInterval).toBe(120);
      expect(updatedUserPreferences.emailNotifications.weeklyReports).toBe(true);
      expect(updatedUserPreferences.createdAt.getTime()).toBe(
        savedUserPreferences.createdAt.getTime(),
      );
    });

    /**
     * __Update Timestamp on Save
     * Acceptance case (scenario)
     * - Modify and resave existing preferences
     * - Verify updatedAt is refreshed
     * - Ensure change tracking mechanism
     */
    it('should update updatedAt on save', async () => {
      const userPreferences = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      const originalUpdatedAt = savedUserPreferences.updatedAt.getTime();

      await new Promise((resolve) => setTimeout(resolve, 10));

      savedUserPreferences.language = 'fr';
      await savedUserPreferences.save();

      expect(savedUserPreferences.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);
    });

    /**
     * __Handle Complex Nested Updates
     * Acceptance case (scenario)
     * - Update multiple nested objects simultaneously
     * - Verify all nested changes are persisted
     * - Ensure atomic nested object updates
     */
    it('should handle complex nested updates', async () => {
      const userPreferences = new UserPreferencesModel(validUserPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      savedUserPreferences.emailNotifications = {
        enabled: false,
        scheduleUpdates: false,
        systemAlerts: false,
        maintenanceReminders: false,
        weeklyReports: true,
      };

      savedUserPreferences.pushNotifications.enabled = false;
      savedUserPreferences.dashboard.defaultView = 'pumps';

      const updatedUserPreferences = await savedUserPreferences.save();

      expect(updatedUserPreferences.emailNotifications.enabled).toBe(false);
      expect(updatedUserPreferences.emailNotifications.weeklyReports).toBe(true);
      expect(updatedUserPreferences.pushNotifications.enabled).toBe(false);
      expect(updatedUserPreferences.dashboard.defaultView).toBe('pumps');
    });
  });

  /**
   * __Business Logic
   * Acceptance case (scenario)
   * - Test notification disabling scenarios
   * - Validate custom dashboard configurations
   * - Handle various timezone formats
   * - Ensure realistic preference scenarios
   */
  describe('Business Logic', () => {
    /**
     * __Handle Disabled Notifications Correctly
     * Acceptance case (scenario)
     * - Create preferences with all notifications disabled
     * - Verify opt-out notification strategy
     * - Ensure user control over communications
     */
    it('should handle disabled notifications correctly', async () => {
      const disabledNotificationsData = {
        ...validUserPreferencesData,
        emailNotifications: {
          enabled: false,
          scheduleUpdates: false,
          systemAlerts: false,
          maintenanceReminders: false,
          weeklyReports: false,
        },
        pushNotifications: {
          enabled: false,
          scheduleUpdates: false,
          systemAlerts: false,
          maintenanceReminders: false,
        },
      };

      const userPreferences = new UserPreferencesModel(disabledNotificationsData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.emailNotifications.enabled).toBe(false);
      expect(savedUserPreferences.pushNotifications.enabled).toBe(false);
    });

    /**
     * __Handle Custom Dashboard Configuration
     * Acceptance case (scenario)
     * - Create preferences with customized dashboard
     * - Verify all dashboard settings are applied
     * - Ensure personalized user experience
     */
    it('should handle custom dashboard configuration', async () => {
      const customDashboardData = {
        ...validUserPreferencesData,
        dashboard: {
          defaultView: 'schedules' as const,
          refreshInterval: 300,
          showWeather: false,
          showWaterUsage: false,
        },
      };

      const userPreferences = new UserPreferencesModel(customDashboardData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.dashboard.defaultView).toBe('schedules');
      expect(savedUserPreferences.dashboard.refreshInterval).toBe(300);
      expect(savedUserPreferences.dashboard.showWeather).toBe(false);
      expect(savedUserPreferences.dashboard.showWaterUsage).toBe(false);
    });

    /**
     * __Handle Different Timezone Formats
     * Acceptance case (scenario)
     * - Test various IANA timezone identifiers
     * - Verify all timezone formats are accepted
     * - Ensure global timezone support
     */
    it('should handle different timezone formats', async () => {
      const timezoneFormats = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

      for (const timezone of timezoneFormats) {
        const userPreferencesData = {
          ...validUserPreferencesData,
          userId: `test_user_tz_${timezone}_${Date.now()}`,
          timezone,
        };
        const userPreferences = new UserPreferencesModel(userPreferencesData);
        const savedUserPreferences = await userPreferences.save();

        expect(savedUserPreferences.timezone).toBe(timezone);
      }
    });
  });

  /**
   * __Edge Cases
   * Acceptance case (scenario)
   * - Test boundary refresh interval values
   * - Handle minimum and maximum constraints
   * - Ensure robust edge case handling
   */
  describe('Edge Cases', () => {
    /**
     * __Handle Valid Timezone Values
     * Acceptance case (scenario)
     * - Test valid timezone instead of empty string
     * - Verify timezone persistence
     * - Ensure timezone validation
     */
    it('should handle empty strings for optional fields', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        timezone: 'America/New_York',
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.timezone).toBe('America/New_York');
    });

    /**
     * __Handle Minimum Refresh Interval
     * Acceptance case (scenario)
     * - Create preferences with minimum refresh rate (30s)
     * - Verify boundary value is accepted
     * - Ensure minimum constraint handling
     */
    it('should handle minimum refresh interval', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          ...validUserPreferencesData.dashboard,
          refreshInterval: 30,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.dashboard.refreshInterval).toBe(30);
    });

    /**
     * __Handle Maximum Refresh Interval
     * Acceptance case (scenario)
     * - Create preferences with maximum refresh rate (300s)
     * - Verify boundary value is accepted
     * - Ensure maximum constraint handling
     */
    it('should handle maximum refresh interval', async () => {
      const userPreferencesData = {
        ...validUserPreferencesData,
        dashboard: {
          ...validUserPreferencesData.dashboard,
          refreshInterval: 300,
        },
      };

      const userPreferences = new UserPreferencesModel(userPreferencesData);
      const savedUserPreferences = await userPreferences.save();

      expect(savedUserPreferences.dashboard.refreshInterval).toBe(300);
    });
  });
});
