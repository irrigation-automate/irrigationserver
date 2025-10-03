/**
 * @fileoverview Central export file for all database models.
 * @description
 * Exports all Mongoose models used in the irrigation system.
 * This file serves as the single point of import for all models.
 *
 * @module models/index
 */

// User-related models (existing)
export { default as UserModel } from './user/User.model';
export { default as UserAddress } from './user/User.adress';
export { default as UserContact } from './user/user.contact';
export { default as UserPassword } from './user/user.password';

// Core irrigation models (new)
export { default as PumpModel } from './Pump.model';
export { default as ZoneModel } from './Zone.model';
export { default as ScheduleModel } from './Schedule.model';

// Authentication models (new)
export { default as SessionModel } from './Session.model';

// Notification models (new)
export { default as NotificationModel } from './Notification.model';
export { default as NotificationSubscriberModel } from './NotificationSubscriber.model';

// Analytics models (new)
export { default as WaterUsageModel } from './WaterUsage.model';
export { default as UserPreferencesModel } from './UserPreferences.model';
