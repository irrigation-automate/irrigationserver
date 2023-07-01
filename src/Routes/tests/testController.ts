import { Request, RequestHandler, Response } from 'express';

export const getTestData: RequestHandler = (_req: Request, res: Response) => {
  return res.send('Express + TypeScript Serving');
};