/**
 * Represents the health status of a database connection.
 */
export interface DatabaseHealthStatus {
  /**
   * Current database status (e.g., "up" | "down").
   */
  status: string;

  /**
   * Database response time in milliseconds (if available).
   */
  responseTime?: number;

  /**
   * Error message if the database is unavailable.
   */
  error?: string;
}

/**
 * Memory usage statistics of the Node.js process.
 * Values are represented as formatted strings (e.g., "123 MB").
 */
export interface MemoryUsage {
  /**
   * Resident Set Size – total memory allocated for the process.
   */
  rss: string;

  /**
   * Total heap memory allocated.
   */
  heapTotal: string;

  /**
   * Heap memory currently used.
   */
  heapUsed: string;

  /**
   * Memory usage outside of the JavaScript heap (e.g., Buffers).
   */
  external: string;
}

/**
 * Full health check response object for the API.
 */
export interface HealthCheckResponse {
  /**
   * Overall system health status (e.g., "healthy" | "degraded" | "down").
   */
  status: string;

  /**
   * Current server timestamp in ISO 8601 format.
   * @example "2025-10-01T01:45:00.000Z"
   */
  timestamp: string;

  /**
   * Uptime of the server in seconds.
   */
  uptime: number;

  /**
   * Database health check result.
   */
  database: DatabaseHealthStatus;

  /**
   * Current memory usage snapshot.
   */
  memory: MemoryUsage;
}

/**
 * Raw database connectivity check result before formatting.
 */
export interface DatabaseCheckResult {
  /**
   * Whether the database is connected or not.
   */
  connected: boolean;

  /**
   * Duration of the database check in milliseconds.
   */
  duration: number;

  /**
   * Error message if the connection failed.
   */
  error?: string;
}

/**
 * @swagger
 * components:
 *   responses:
 *     HealthCheckResponse:
 *       description: Full health check response containing system status, timestamp, uptime and dependency details.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               uptime:
 *                 type: number
 *               database:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   responseTime:
 *                     type: number
 *                   error:
 *                     type: string
 *               memory:
 *                 type: object
 *                 properties:
 *                   rss:
 *                     type: string
 *                   heapTotal:
 *                     type: string
 *                   heapUsed:
 *                     type: string
 *                   external:
 *                     type: string
 *     DatabaseCheckResultResponse:
 *       description: Raw database connectivity check result.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connected:
 *                 type: boolean
 *               duration:
 *                 type: number
 *               error:
 *                 type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DatabaseCheckResult:
 *       type: object
 *       properties:
 *         connected:
 *           type: boolean
 *         duration:
 *           type: number
 *         error:
 *           type: string
 *     HealthCheckResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         uptime:
 *           type: number
 *         database:
 *           $ref: '#/components/schemas/DatabaseCheckResult'
 *         memory:
 *           type: object
 *           properties:
 *             rss:
 *               type: string
 *             heapTotal:
 *               type: string
 *             heapUsed:
 *               type: string
 *             external:
 *               type: string
 *   examples:
 *     DBUp:
 *       summary: Database is reachable
 *       value:
 *         connected: true
 *         duration: 12
 *     DBDown:
 *       summary: Database is unreachable
 *       value:
 *         connected: false
 *         duration: 0
 *         error: "Connection refused"
 *     HealthOK:
 *       summary: Full system healthy example
 *       value:
 *         status: "healthy"
 *         timestamp: "2025-11-22T00:00:00.000Z"
 *         uptime: 12345
 *         database:
 *           connected: true
 *           duration: 12
 *         memory:
 *           rss: "50 MB"
 *           heapTotal: "60 MB"
 *           heapUsed: "30 MB"
 *           external: "5 MB"
 */
