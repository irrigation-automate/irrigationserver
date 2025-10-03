/**
 * __NotificationSubscriber Model Unit Tests
 * Acceptance case (scenario)
 * - Create notification subscribers with valid data
 * - Validate required field constraints
 * - Test enum constraints for notification channels
 * - Verify default values for seen status
 * - Handle seen/unseen status updates
 * - Test subscription management operations
 * - Validate data integrity across updates
 * - Handle business logic for notification delivery
 * - Manage subscriber queries by user and notification
 * - Test edge cases with mixed subscription statuses
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import NotificationSubscriberModel, {
  INotificationSubscriber,
} from '../../src/Models/NotificationSubscriber.model';

describe('NotificationSubscriber Model', () => {
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
    await NotificationSubscriberModel.deleteMany({});
  });

  const validNotificationSubscriberData = {
    notificationId: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    channel: 'email' as const,
  };

  const validNotificationSubscriberWithTimestamps = {
    ...validNotificationSubscriberData,
    seenAt: new Date('2023-06-15T10:30:00Z'),
    sentAt: new Date('2023-06-15T10:00:00Z'),
  };

  describe('Valid NotificationSubscriber Creation', () => {
    it('should create a notification subscriber with valid data', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber._id).toBeDefined();
      expect(savedSubscriber.notificationId).toBe(validNotificationSubscriberData.notificationId);
      expect(savedSubscriber.userId).toBe(validNotificationSubscriberData.userId);
      expect(savedSubscriber.channel).toBe(validNotificationSubscriberData.channel);
      expect(savedSubscriber.seen).toBe(false);
      expect(savedSubscriber.createdAt).toBeDefined();
      expect(savedSubscriber.updatedAt).toBeDefined();
    });

    it('should create a notification subscriber with timestamps', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberWithTimestamps);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seenAt).toEqual(validNotificationSubscriberWithTimestamps.seenAt);
      expect(savedSubscriber.sentAt).toEqual(validNotificationSubscriberWithTimestamps.sentAt);
      expect(savedSubscriber.seen).toBe(false);
    });

    it('should create a notification subscriber with seen status', async () => {
      const seenSubscriberData = {
        ...validNotificationSubscriberData,
        seen: true,
        seenAt: new Date('2023-06-15T11:00:00Z'),
      };

      const subscriber = new NotificationSubscriberModel(seenSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seen).toBe(true);
      expect(savedSubscriber.seenAt).toEqual(seenSubscriberData.seenAt);
    });
  });

  describe('Required Field Validation', () => {
    it('should require notificationId field', async () => {
      const subscriberData = { ...validNotificationSubscriberData, notificationId: undefined };

      const subscriber = new NotificationSubscriberModel(subscriberData);

      let error: any;
      try {
        await subscriber.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.notificationId).toBeDefined();
    });

    it('should require userId field', async () => {
      const subscriberData = { ...validNotificationSubscriberData, userId: undefined };

      const subscriber = new NotificationSubscriberModel(subscriberData);

      let error: any;
      try {
        await subscriber.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.userId).toBeDefined();
    });

    it('should require channel field', async () => {
      const subscriberData = { ...validNotificationSubscriberData, channel: undefined };

      const subscriber = new NotificationSubscriberModel(subscriberData);

      let error: any;
      try {
        await subscriber.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.channel).toBeDefined();
    });
  });

  describe('Field Constraints', () => {
    it('should enforce channel enum constraint', async () => {
      const subscriberData = {
        ...validNotificationSubscriberData,
        channel: 'invalid_channel' as any,
      };

      const subscriber = new NotificationSubscriberModel(subscriberData);

      let error: any;
      try {
        await subscriber.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.channel).toBeDefined();
    });

    it('should accept valid channel values', async () => {
      const validChannels = ['email', 'push', 'sms', 'webhook'];

      for (const channel of validChannels) {
        const subscriberData = {
          ...validNotificationSubscriberData,
          userId: `test_user_${channel}_${Date.now()}`,
          notificationId: `test_notification_${channel}_${Date.now()}`,
          channel: channel as any,
        };
        const subscriber = new NotificationSubscriberModel(subscriberData);
        const savedSubscriber = await subscriber.save();

        expect(savedSubscriber.channel).toBe(channel);
      }
    });
  });

  describe('Default Values', () => {
    it('should set default seen to false', async () => {
      const subscriberData = { ...validNotificationSubscriberData, seen: undefined };
      const subscriber = new NotificationSubscriberModel(subscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seen).toBe(false);
    });

    it('should set timestamps', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.createdAt).toBeInstanceOf(Date);
      expect(savedSubscriber.updatedAt).toBeInstanceOf(Date);
      expect(savedSubscriber.createdAt.getTime()).toBe(savedSubscriber.updatedAt.getTime());
    });

    it('should update updatedAt on save', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      const originalUpdatedAt = savedSubscriber.updatedAt.getTime();

      await new Promise((resolve) => setTimeout(resolve, 10));

      savedSubscriber.seen = true;
      savedSubscriber.seenAt = new Date();
      await savedSubscriber.save();

      expect(savedSubscriber.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);
    });
  });

  /**
   * __Subscription Management
   * Acceptance case (scenario)
   * - Test notification marking as seen functionality
   * - Validate notification delivery timestamp tracking
   * - Handle multiple subscribers for same notification
   * - Manage user subscription relationships
   */
  describe('Subscription Management', () => {
    /**
     * __Mark Notification as Seen
     * Acceptance case (scenario)
     * - Update subscriber seen status to true
     * - Record seen timestamp for tracking
     * - Verify notification acknowledgment workflow
     */
    it('should handle notification marking as seen', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seen).toBe(false);
      expect(savedSubscriber.seenAt).toBeUndefined();

      savedSubscriber.seen = true;
      savedSubscriber.seenAt = new Date();
      const updatedSubscriber = await savedSubscriber.save();

      expect(updatedSubscriber.seen).toBe(true);
      expect(updatedSubscriber.seenAt).toBeInstanceOf(Date);
    });

    /**
     * __Mark Notification as Sent
     * Acceptance case (scenario)
     * - Update subscriber sent timestamp
     * - Track notification delivery time
     * - Verify delivery confirmation workflow
     */
    it('should handle notification marking as sent', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.sentAt).toBeUndefined();

      savedSubscriber.sentAt = new Date();
      const updatedSubscriber = await savedSubscriber.save();

      expect(updatedSubscriber.sentAt).toBeInstanceOf(Date);
    });

    /**
     * __Handle Multiple Subscribers per Notification
     * Acceptance case (scenario)
     * - Create multiple subscribers for same notification
     * - Verify different users can subscribe to same notification
     * - Test notification broadcasting capability
     */
    it('should handle multiple subscribers for same notification', async () => {
      const subscriber1 = new NotificationSubscriberModel(validNotificationSubscriberData);
      await subscriber1.save();

      const subscriber2 = new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439013',
        channel: 'push',
      });

      const savedSubscriber2 = await subscriber2.save();

      expect(savedSubscriber2.notificationId).toBe(validNotificationSubscriberData.notificationId);
      expect(savedSubscriber2.userId).toBe('507f1f77bcf86cd799439013');
      expect(savedSubscriber2.channel).toBe('push');
    });

    /**
     * __Handle Multiple Subscriptions per User
     * Acceptance case (scenario)
     * - Create multiple subscriptions for same user
     * - Verify user can subscribe to different notifications
     * - Test user notification preference management
     */
    it('should handle multiple subscribers for same user', async () => {
      const subscriber1 = new NotificationSubscriberModel(validNotificationSubscriberData);
      await subscriber1.save();

      const subscriber2 = new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: validNotificationSubscriberData.userId,
        notificationId: '507f1f77bcf86cd799439014',
        channel: 'sms',
      });

      const savedSubscriber2 = await subscriber2.save();

      expect(savedSubscriber2.userId).toBe(validNotificationSubscriberData.userId);
      expect(savedSubscriber2.notificationId).toBe('507f1f77bcf86cd799439014');
      expect(savedSubscriber2.channel).toBe('sms');
    });
  });

  /**
   * __Data Integrity
   * Acceptance case (scenario)
   * - Test data consistency across multiple save operations
   * - Verify field relationships are maintained during updates
   * - Handle seen status state transitions
   * - Ensure timestamp tracking accuracy
   */
  describe('Data Integrity', () => {
    /**
     * __Verify Data Consistency Across Saves
     * Acceptance case (scenario)
     * - Create and save notification subscriber
     * - Modify fields and save again
     * - Verify all data relationships are maintained
     */
    it('should maintain data consistency across saves', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      savedSubscriber.channel = 'push';
      savedSubscriber.seen = true;
      savedSubscriber.seenAt = new Date();

      const updatedSubscriber = await savedSubscriber.save();

      expect(updatedSubscriber.channel).toBe('push');
      expect(updatedSubscriber.seen).toBe(true);
      expect(updatedSubscriber.seenAt).toBeInstanceOf(Date);
      expect(updatedSubscriber.createdAt.getTime()).toBe(savedSubscriber.createdAt.getTime());
    });

    /**
     * __Handle Seen Status State Transitions
     * Acceptance case (scenario)
     * - Test marking notification as seen and unseen
     * - Verify seenAt timestamp is managed correctly
     * - Ensure proper state transition handling
     */
    it('should handle seen status updates', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seen).toBe(false);

      savedSubscriber.seen = true;
      savedSubscriber.seenAt = new Date('2023-06-15T14:30:00Z');
      const seenSubscriber = await savedSubscriber.save();

      expect(seenSubscriber.seen).toBe(true);
      expect(seenSubscriber.seenAt).toEqual(new Date('2023-06-15T14:30:00Z'));

      seenSubscriber.seen = false;
      seenSubscriber.seenAt = undefined;
      const unseenSubscriber = await seenSubscriber.save();

      expect(unseenSubscriber.seen).toBe(false);
      expect(unseenSubscriber.seenAt).toBeUndefined();
    });

    /**
     * __Handle Sent Status Timestamp Updates
     * Acceptance case (scenario)
     * - Test sent timestamp assignment and updates
     * - Verify delivery time tracking accuracy
     * - Ensure notification delivery audit trail
     */
    it('should handle sent status updates', async () => {
      const subscriber = new NotificationSubscriberModel(validNotificationSubscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.sentAt).toBeUndefined();

      savedSubscriber.sentAt = new Date('2023-06-15T12:00:00Z');
      const sentSubscriber = await savedSubscriber.save();

      expect(sentSubscriber.sentAt).toEqual(new Date('2023-06-15T12:00:00Z'));

      sentSubscriber.sentAt = new Date('2023-06-15T13:00:00Z');
      const reSentSubscriber = await sentSubscriber.save();

      expect(reSentSubscriber.sentAt).toEqual(new Date('2023-06-15T13:00:00Z'));
    });
  });

  describe('Business Logic', () => {
    /**
     * __Handle Subscription Cleanup Operations
     * Acceptance case (scenario)
     * - Create multiple subscribers for testing
     * - Delete subscribers for specific notifications
     * - Verify selective cleanup functionality
     */
    it('should handle subscription cleanup scenarios', async () => {
      const subscribers: INotificationSubscriber[] = [];
      for (let i = 0; i < 3; i++) {
        const subscriberData = {
          ...validNotificationSubscriberData,
          userId: `507f1f77bcf86cd79943901${i}`,
          notificationId: `507f1f77bcf86cd79943902${i}`,
          channel: (['email', 'push', 'sms'] as const)[i % 3],
        };
        subscribers.push(await new NotificationSubscriberModel(subscriberData).save());
      }

      expect(subscribers).toHaveLength(3);

      await NotificationSubscriberModel.deleteMany({
        notificationId: '507f1f77bcf86cd799439020',
      });

      const remainingSubscribers = await NotificationSubscriberModel.find({
        notificationId: '507f1f77bcf86cd799439020',
      });
      expect(remainingSubscribers).toHaveLength(0);

      const otherSubscribers = await NotificationSubscriberModel.find({
        notificationId: '507f1f77bcf86cd799439021',
      });
      expect(otherSubscribers).toHaveLength(1);
    });

    /**
     * __Handle User Subscription Queries
     * Acceptance case (scenario)
     * - Create subscribers for different users
     * - Query subscriptions by user ID
     * - Verify user-specific subscription retrieval
     */
    it('should handle user subscription queries', async () => {
      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439015',
      }).save();

      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439016',
        notificationId: '507f1f77bcf86cd799439017',
      }).save();

      const user1Subscriptions = await NotificationSubscriberModel.find({
        userId: '507f1f77bcf86cd799439015',
      });

      expect(user1Subscriptions).toHaveLength(1);
      expect(user1Subscriptions[0].userId).toBe('507f1f77bcf86cd799439015');

      const user2Subscriptions = await NotificationSubscriberModel.find({
        userId: '507f1f77bcf86cd799439016',
      });

      expect(user2Subscriptions).toHaveLength(1);
      expect(user2Subscriptions[0].userId).toBe('507f1f77bcf86cd799439016');
    });

    /**
     * __Handle Notification Subscription Queries
     * Acceptance case (scenario)
     * - Create subscribers for different notifications
     * - Query subscriptions by notification ID
     * - Verify notification-specific subscriber retrieval
     */
    it('should handle notification subscription queries', async () => {
      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        notificationId: '507f1f77bcf86cd799439018',
      }).save();

      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        notificationId: '507f1f77bcf86cd799439019',
        userId: '507f1f77bcf86cd799439017',
      }).save();

      const notification1Subscriptions = await NotificationSubscriberModel.find({
        notificationId: '507f1f77bcf86cd799439018',
      });

      expect(notification1Subscriptions).toHaveLength(1);
      expect(notification1Subscriptions[0].notificationId).toBe('507f1f77bcf86cd799439018');

      const notification2Subscriptions = await NotificationSubscriberModel.find({
        notificationId: '507f1f77bcf86cd799439019',
      });

      expect(notification2Subscriptions).toHaveLength(1);
      expect(notification2Subscriptions[0].notificationId).toBe('507f1f77bcf86cd799439019');
    });

    /**
     * __Handle Seen Status Filtering
     * Acceptance case (scenario)
     * - Create mix of seen and unseen subscribers
     * - Query by seen status
     * - Verify filtering functionality for analytics
     */
    it('should handle seen/unseen status filtering', async () => {
      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439018',
        seen: true,
        seenAt: new Date(),
      }).save();

      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439019',
        seen: false,
      }).save();

      const seenSubscriptions = await NotificationSubscriberModel.find({ seen: true });
      expect(seenSubscriptions).toHaveLength(1);
      expect(seenSubscriptions[0].seen).toBe(true);

      const unseenSubscriptions = await NotificationSubscriberModel.find({ seen: false });
      expect(unseenSubscriptions).toHaveLength(1);
      expect(unseenSubscriptions[0].seen).toBe(false);
    });
  });

  /**
   * __Edge Cases
   * Acceptance case (scenario)
   * - Test null optional field handling
   * - Validate undefined optional field behavior
   * - Handle mixed seen statuses for same notification
   * - Test boundary conditions and error scenarios
   */
  describe('Edge Cases', () => {
    /**
     * __Handle Null Optional Fields
     * Acceptance case (scenario)
     * - Create subscriber with null optional fields
     * - Verify null values are properly stored
     * - Test nullable field behavior
     */
    it('should handle null optional fields', async () => {
      const subscriberData = {
        ...validNotificationSubscriberData,
        seenAt: null,
        sentAt: null,
      };

      const subscriber = new NotificationSubscriberModel(subscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seenAt).toBeNull();
      expect(savedSubscriber.sentAt).toBeNull();
    });

    /**
     * __Handle Undefined Optional Fields
     * Acceptance case (scenario)
     * - Create subscriber with undefined optional fields
     * - Verify undefined values are properly handled
     * - Test optional field default behavior
     */
    it('should handle undefined optional fields', async () => {
      const subscriberData = {
        ...validNotificationSubscriberData,
        seenAt: undefined,
        sentAt: undefined,
      };

      const subscriber = new NotificationSubscriberModel(subscriberData);
      const savedSubscriber = await subscriber.save();

      expect(savedSubscriber.seenAt).toBeUndefined();
      expect(savedSubscriber.sentAt).toBeUndefined();
    });

    /**
     * __Handle Mixed Seen Statuses for Same Notification
     * Acceptance case (scenario)
     * - Create multiple subscribers with different seen statuses
     * - Query all subscribers for notification
     * - Verify mixed status handling and analytics
     */
    it('should handle mixed seen statuses for same notification', async () => {
      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439020',
        seen: true,
        seenAt: new Date(),
      }).save();

      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439021',
        seen: false,
      }).save();

      await new NotificationSubscriberModel({
        ...validNotificationSubscriberData,
        userId: '507f1f77bcf86cd799439022',
        seen: true,
        seenAt: new Date(),
      }).save();

      const allSubscribers = await NotificationSubscriberModel.find({
        notificationId: validNotificationSubscriberData.notificationId,
      });

      expect(allSubscribers).toHaveLength(3);

      const seenCount = allSubscribers.filter((s) => s.seen).length;
      const unseenCount = allSubscribers.filter((s) => !s.seen).length;

      expect(seenCount).toBe(2);
      expect(unseenCount).toBe(1);
    });
  });
});
