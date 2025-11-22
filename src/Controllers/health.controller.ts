import { Request, Response } from "express";
import healthService from "../Services/health.service";
import { HealthCheckResponse } from "../interface/interfaces/health.interface";

class HealthController {
  /**
   * @route GET /health
   * @description Health check endpoint
   * @access Public
   */
  public async getHealth(req: Request, res: Response) {
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

    return res.success(healthData, req.t("success", { ns: "health" }));
  }

  /**
   * @route GET /health/readiness
   * @description Readiness probe
   * @access Public
   */
  public async getReadiness(req: Request, res: Response) {
    const dbCheck = await healthService.checkDatabaseConnection();

    if (!dbCheck.connected) {
      return res.error(req.t("readiness_down", { ns: "health" }), 503, {
        status: "DOWN",
        timestamp: healthService.getCurrentTimestamp(),
        database: { status: "ERROR", error: dbCheck.error },
      });
    }

    return res.success(
      {
        status: "UP",
        timestamp: healthService.getCurrentTimestamp(),
      },
      req.t("readiness_up", { ns: "health" }),
    );
  }

  /**
   * @route GET /health/liveness
   * @description Liveness probe
   * @access Public
   */
  public getLiveness(req: Request, res: Response) {
    return res.success(
      { status: "UP", timestamp: healthService.getCurrentTimestamp() },
      req.t("liveness_ok", { ns: "health" }),
    );
  }
}

export default new HealthController();
