import { Router } from 'express';
import healthController from '../Controllers/health.controller';

const router = Router();

/**
 * @route GET /health
 * @description Health check endpoint
 * @access Public
 */
router.get('/', healthController.getHealth);

/**
 * @route GET /health/readiness
 * @description Kubernetes readiness probe
 * @access Public
 */
router.get('/readiness', healthController.getReadiness);

/**
 * @route GET /health/liveness
 * @description Kubernetes liveness probe
 * @access Public
 */
router.get('/liveness', healthController.getLiveness);

export default router;
