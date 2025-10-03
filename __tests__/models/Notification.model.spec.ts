/**
 * __Notification Model Unit Tests
 * Acceptance case (scenario)
 * - Create system notifications with valid data
 * - Validate required field constraints
 * - Test field length constraints for titles and messages
 * - Verify enum constraints for notification status and priority
 * - Handle payload structure validation
 * - Test default value assignments
 * - Validate data integrity across updates
 * - Test business logic for notification management
 * - Handle edge cases with various notification types
 * - Verify notification categorization and priority handling
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import NotificationModel from '../../src/Models/Notification.model';

describe('Notification Model', () => {
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
    await NotificationModel.deleteMany({});
  });

  const validNotificationData = {
    moduleName: 'IrrigationService',
    action: 'schedule_completed',
    status: 'pending' as const,
    payload: {
      title: 'Irrigation Completed',
      message: 'Zone North Garden has completed its scheduled irrigation.',
      priority: 'normal' as const,
      category: 'irrigation',
    },
  };

  /**
   * __Valid Notification Creation
   * Acceptance case (scenario)
   * - Create system notifications with complete data
   * - Verify all fields are properly saved
   * - Test payload structure handling
   * - Validate priority level assignments
   */
  describe('Valid Notification Creation', () => {
    /**
     * __Create Basic System Notification
     * Acceptance case (scenario)
     * - Create notification with all required fields
     * - Verify document is saved with correct data
     * - Check timestamps are generated
     */
    it('should create a notification with valid data', async () => {
      const notification = new NotificationModel(validNotificationData);
      const savedNotification = await notification.save();

      expect(savedNotification._id).toBeDefined();
      expect(savedNotification.moduleName).toBe(validNotificationData.moduleName);
      expect(savedNotification.action).toBe(validNotificationData.action);
      expect(savedNotification.status).toBe(validNotificationData.status);
      expect(savedNotification.payload.title).toBe(validNotificationData.payload.title);
      expect(savedNotification.payload.message).toBe(validNotificationData.payload.message);
      expect(savedNotification.payload.priority).toBe(validNotificationData.payload.priority);
      expect(savedNotification.payload.category).toBe(validNotificationData.payload.category);
      expect(savedNotification.createdAt).toBeDefined();
      expect(savedNotification.updatedAt).toBeDefined();
    });

    /**
     * __Create High Priority Notification
     * Acceptance case (scenario)
     * - Create notification with urgent priority level
     * - Verify priority escalation handling
     * - Test critical system alert scenarios
     */
    it('should create a notification with high priority', async () => {
      const highPriorityNotification = {
        ...validNotificationData,
        payload: {
          ...validNotificationData.payload,
          priority: 'urgent' as const,
        },
      };

      const notification = new NotificationModel(highPriorityNotification);
      const savedNotification = await notification.save();

      expect(savedNotification.payload.priority).toBe('urgent');
    });
  });

  /**
   * __Required Field Validation
   * Acceptance case (scenario)
   * - Test that required fields cannot be undefined
   * - Verify validation errors are thrown for missing fields
   * - Ensure notification integrity by enforcing field requirements
   */
  describe('Required Field Validation', () => {
    /**
     * __Validate Required moduleName Field
     * Acceptance case (scenario)
     * - Attempt to save without moduleName
     * - Verify validation error is thrown
     * - Ensure notification source identification
     */
    it('should require moduleName field', async () => {
      const notificationData = { ...validNotificationData, moduleName: undefined };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.moduleName).toBeDefined();
    });

    /**
     * __Validate Required action Field
     * Acceptance case (scenario)
     * - Attempt to save without action
     * - Verify validation error is thrown
     * - Ensure notification event identification
     */
    it('should require action field', async () => {
      const notificationData = { ...validNotificationData, action: undefined };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.action).toBeDefined();
    });
  });

  /**
   * __Field Constraints Validation
   * Acceptance case (scenario)
   * - Test field length constraints for titles and messages
   * - Verify enum constraints for status and priority
   * - Validate payload structure requirements
   * - Ensure data quality for notification content
   */
  describe('Field Constraints', () => {
    /**
     * __Validate moduleName Maximum Length
     * Acceptance case (scenario)
     * - Test module name length boundary (100 characters)
     * - Verify excessively long names are rejected
     * - Ensure reasonable identifier lengths
     */
    it('should enforce moduleName maxlength constraint', async () => {
      const longName = 'A'.repeat(101);
      const notificationData = { ...validNotificationData, moduleName: longName };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.moduleName).toBeDefined();
    });

    /**
     * __Validate action Maximum Length
     * Acceptance case (scenario)
     * - Test action field length boundary (100 characters)
     * - Verify excessively long actions are rejected
     * - Ensure reasonable event description lengths
     */
    it('should enforce action maxlength constraint', async () => {
      const longAction = 'A'.repeat(101);
      const notificationData = { ...validNotificationData, action: longAction };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.action).toBeDefined();
    });

    /**
     * __Validate Title Maximum Length
     * Acceptance case (scenario)
     * - Test notification title length boundary (200 characters)
     * - Verify excessively long titles are rejected
     * - Ensure readable notification titles
     */
    it('should enforce title maxlength constraint', async () => {
      const longTitle = 'A'.repeat(201);
      const notificationData = {
        ...validNotificationData,
        payload: {
          ...validNotificationData.payload,
          title: longTitle,
        },
      };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['payload.title']).toBeDefined();
    });

    /**
     * __Validate Message Maximum Length
     * Acceptance case (scenario)
     * - Test notification message length boundary (1000 characters)
     * - Verify excessively long messages are rejected
     * - Ensure readable notification content
     */
    it('should enforce message maxlength constraint', async () => {
      const longMessage = 'A'.repeat(1001);
      const notificationData = {
        ...validNotificationData,
        payload: {
          ...validNotificationData.payload,
          message: longMessage,
        },
      };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['payload.message']).toBeDefined();
    });

    /**
     * __Validate Category Maximum Length
     * Acceptance case (scenario)
     * - Test notification category length boundary (50 characters)
     * - Verify excessively long categories are rejected
     * - Ensure organized notification categorization
     */
    it('should enforce category maxlength constraint', async () => {
      const longCategory = 'A'.repeat(51);
      const notificationData = {
        ...validNotificationData,
        payload: {
          ...validNotificationData.payload,
          category: longCategory,
        },
      };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['payload.category']).toBeDefined();
    });
  });

  /**
   * __Enum Validation
   * Acceptance case (scenario)
   * - Test enum constraints for notification status
   * - Verify priority level enum constraints
   * - Ensure only valid enumerated values are accepted
   * - Maintain data consistency with predefined options
   */
  describe('Enum Validation', () => {
    /**
     * __Validate Status Enum Constraint
     * Acceptance case (scenario)
     * - Test invalid status value rejection
     * - Verify only valid status values are accepted
     * - Ensure notification state consistency
     */
    it('should enforce status enum constraint', async () => {
      const notificationData = { ...validNotificationData, status: 'invalid_status' };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });

    /**
     * __Validate Priority Enum Constraint
     * Acceptance case (scenario)
     * - Test invalid priority value rejection
     * - Verify only valid priority levels are accepted
     * - Ensure notification urgency classification
     */
    it('should enforce priority enum constraint', async () => {
      const notificationData = {
        ...validNotificationData,
        payload: {
          ...validNotificationData.payload,
          priority: 'invalid_priority' as any,
        },
      };

      const notification = new NotificationModel(notificationData);

      let error: any;
      try {
        await notification.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['payload.priority']).toBeDefined();
    });
  });

  /**
   * __Default Values
   * Acceptance case (scenario)
   * - Test automatic default value assignment
   * - Verify default status is set to pending
   * - Validate default priority assignment
   * - Ensure default payload data structure
   */
  describe('Default Values', () => {
    /**
     * __Verify Default Status Assignment
     * Acceptance case (scenario)
     * - Create notification without explicit status
     * - Verify default status is automatically set
     * - Ensure new notifications start in pending state
     */
    it('should set default status to pending', async () => {
      const notificationData = { ...validNotificationData, status: undefined };

      const notification = new NotificationModel(notificationData);
      const savedNotification = await notification.save();

      expect(savedNotification.status).toBe('pending');
    });

    /**
     * __Verify Default Priority Assignment
     * Acceptance case (scenario)
     * - Create notification without explicit priority
     * - Verify default priority is automatically set
     * - Ensure notifications have appropriate default urgency
     */
    it('should set default priority to normal', async () => {
      const notificationData = {
        ...validNotificationData,
        payload: {
          title: 'Test',
          message: 'Test message',
        },
      };

      const notification = new NotificationModel(notificationData);
      const savedNotification = await notification.save();

      expect(savedNotification.payload.priority).toBe('normal');
    });

    /**
     * __Verify Default Payload Data Structure
     * Acceptance case (scenario)
     * - Create notification without explicit payload data
     * - Verify default empty object is assigned
     * - Ensure payload structure integrity
     */
    it('should set default payload data to empty object', async () => {
      const notificationData = {
        ...validNotificationData,
        payload: {
          title: 'Test',
          message: 'Test message',
        },
      };

      const notification = new NotificationModel(notificationData);
      const savedNotification = await notification.save();

      expect(savedNotification.payload.data).toEqual({});
    });

    /**
     * __Verify Automatic Timestamp Generation
     * Acceptance case (scenario)
     * - Create notification without explicit timestamps
     * - Verify createdAt and updatedAt are generated
     * - Ensure timestamp consistency on creation
     */
    it('should set timestamps', async () => {
      const notification = new NotificationModel(validNotificationData);
      const savedNotification = await notification.save();

      expect(savedNotification.createdAt).toBeInstanceOf(Date);
      expect(savedNotification.updatedAt).toBeInstanceOf(Date);
      expect(savedNotification.createdAt.getTime()).toBe(savedNotification.updatedAt.getTime());
    });
  });
});
