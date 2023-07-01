import request from 'supertest';
import app from '..';

describe('GET /test', () => {
  it('responds with "Express + TypeScript Servering"', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Express + TypeScript Servering');
  });
});