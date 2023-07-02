// ==============================|| based test server running route ||============================== //

// ======|| import route request types from Express
import { Request, RequestHandler, Response } from 'express';

// ======|| get test route from server running
export const getTestData: RequestHandler = (_req: Request, res: Response) => {
  return res.status(200).send('Express + TypeScript Serving');
};