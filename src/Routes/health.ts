import { Router } from "express";
import healthController from "../Controllers/health.controller";

/**
 * @swagger
 * tags:
 *   - name: HealthCare
 *     description: Health endpoints and system status checks for the API and its dependencies.
 *     x-need: "*"
 */

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Returns overall system health including uptime, a timestamp, and the status of critical dependencies.
 *     tags:
 *       - HealthCare
 *     parameters:
 *       - $ref: '#/components/parameters/LanguageHeader'
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *             examples:
 *               healthy:
 *                 $ref: '#/components/examples/HealthOK'
 */
router.get("/", healthController.getHealth);

/**
 * @swagger
 * /api/health/readiness:
 *   get:
 *     summary: Readiness probe
 *     description: Readiness probe used by orchestrators to determine if the application is ready to accept traffic. Performs dependency checks (database connectivity, external services).
 *     tags:
 *       - HealthCare
 *     parameters:
 *       - $ref: '#/components/parameters/LanguageHeader'
 *     responses:
 *       200:
 *         description: Ready for traffic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatabaseCheckResult'
 *             examples:
 *               db_up:
 *                 $ref: '#/components/examples/DBUp'
 *       503:
 *         description: Not ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatabaseCheckResult'
 *             examples:
 *               db_down:
 *                 $ref: '#/components/examples/DBDown'
 */
router.get("/readiness", healthController.getReadiness);

/**
 * @swagger
 * /api/health/liveness:
 *   get:
 *     summary: Liveness probe
 *     description: Liveness probe used by orchestrators to verify the application process is alive and responsive. Does light-weight checks and should not perform expensive operations.
 *     tags:
 *       - HealthCare
 *     parameters:
 *       - $ref: '#/components/parameters/LanguageHeader'
 *     responses:
 *       200:
 *         description: Alive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatabaseCheckResult'
 *             examples:
 *               ok:
 *                 $ref: '#/components/examples/DBUp'
 *       500:
 *         description: Failed liveness
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatabaseCheckResult'
 *             examples:
 *               fail:
 *                 $ref: '#/components/examples/DBDown'
 */
router.get("/liveness", healthController.getLiveness);

export default router;
