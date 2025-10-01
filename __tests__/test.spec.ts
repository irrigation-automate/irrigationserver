import request from 'supertest';
import app from '../src/index';

/**
 * Test suite for basic API endpoints, primarily the `/api/test` endpoint
 * and handling of unknown routes.
 */
describe('Test Endpoint', () => {

  /**
   * Test the `/api/test` endpoint for a successful server status response.
   */
  it('should return a success response with server status', async () => {
    const response = await request(app).get('/api/test');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Success',
      timestamp: expect.any(String),
      data: {
        message: expect.any(String),
        status: 'active',
        version: expect.any(String),
        timestamp: expect.any(String)
      }
    });
  });

  /**
   * Test handling of requests to non-existent routes.
   * Should return a 404 Not Found response.
   */
  it('should return a 404 for non-existent routes', async () => {
    const response = await request(app).get('/api/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Not Found',
        status: 404,
        timestamp: expect.any(String)
      }
    });
  });
});
