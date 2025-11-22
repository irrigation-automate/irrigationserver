import { Request, Response } from "express";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../utils/responseHelpers";
import healthService from "../Services/health.service";
import { HealthCheckResponse } from "../interface/interfaces/health.interface";

class HealthController {
  /**
   * @route GET /health
   * @description Health check endpoint
   * @access Public
   */
  public async getHealth(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    const dbCheck = await healthService.checkDatabaseConnection();

    const healthData: HealthCheckResponse = {
      status: "UP",
      timestamp: healthService.getCurrentTimestamp(),
      uptime: healthService.getUptime(),
      database: {
        status: dbCheck.connected ? "CONNECTED" : "DISCONNECTED",
        responseTime: dbCheck.duration,
        ...(dbCheck.error && { error: dbCheck.error }),
      },
      memory: healthService.getMemoryUsage(),
    };

    if (!dbCheck.connected) {
      healthData.status = "DEGRADED";
      healthData.database.status = "ERROR";
    }

    const responseTime = Date.now() - startTime;
    res.setHeader("X-Response-Time", `${responseTime}ms`);

    res
      .status(200)
      .json(
        createSuccessResponse(
          healthData,
          req.t("success.health_ok", { ns: "health" }),
        ),
      );
  }

  /**
   * @route GET /health/readiness
   * @description Readiness probe
   * @access Public
   */
  public async getReadiness(req: Request, res: Response): Promise<void> {
    const dbCheck = await healthService.checkDatabaseConnection();

    if (!dbCheck.connected) {
      res
        .status(503)
        .json(
          createErrorResponse(
            req.t("errors.db_disconnected", { ns: "health" }),
            503,
          ),
        );
      return;
    }

    res.status(200).json({
      status: "UP",
      timestamp: healthService.getCurrentTimestamp(),
    });
  }

  /**
   * @route GET /health/liveness
   * @description Liveness probe
   * @access Public
   */
  public getLiveness(_req: Request, res: Response): void {
    res.status(200).json({
      status: "UP",
      timestamp: healthService.getCurrentTimestamp(),
    });
  }
}

export default new HealthController();
