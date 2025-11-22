import mongoose from "mongoose";
import {
  DatabaseCheckResult,
  MemoryUsage,
} from "../interface/interfaces/health.interface";
import { t } from "i18next";

/**
 * Service for handling health check related operations
 */
class HealthService {
  /**
   * Checks the database connection status and response time
   * @returns {Promise<DatabaseCheckResult>} Database connection status and metrics
   */
  public async checkDatabaseConnection(): Promise<DatabaseCheckResult> {
    const startTime = Date.now();

    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();

        return {
          connected: true,
          duration: Date.now() - startTime,
        };
      }

      return {
        connected: false,
        duration: Date.now() - startTime,
        error: "Mongoose not connected",
      };
    } catch (error) {
      return {
        connected: false,
        duration: Date.now() - startTime,
        error:
          error instanceof Error ? error.message : t("database.unknown_error"),
      };
    }
  }

  /**
   * Gets current memory usage in a human-readable format
   * @returns {MemoryUsage} Object containing memory usage statistics
   */
  public getMemoryUsage(): MemoryUsage {
    const memoryUsage = process.memoryUsage();

    return {
      rss: `${t("memory.rss")}: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${t("memory.heap_total")}: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${t("memory.heap_used")}: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${t("memory.external")}: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    };
  }

  /**
   * Gets current uptime in seconds
   * @returns {number} Uptime in seconds
   */
  public getUptime(): number {
    return process.uptime();
  }

  /**
   * Gets current timestamp in ISO format
   * @returns {string} ISO timestamp
   */
  public getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}

export default new HealthService();
