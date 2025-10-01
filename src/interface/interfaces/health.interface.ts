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
  