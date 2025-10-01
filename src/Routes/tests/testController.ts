/**
 * @module Routes/tests/testController
 * @description Test controller with example endpoints for API testing and validation.
 */

import { Request, Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse } from '../../utils/responseHelpers';

/**
 * Test endpoint to verify the API is running
 * @route GET /api/test
 * @returns {Object} Success message with server status
 * @throws {Error} 500 - Server error
 */
export const getTestData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const testData = {
      message: 'Express + TypeScript Server is running',
      status: 'active',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(createSuccessResponse(testData));
  } catch (error) {
    next(error);
  }
};

/**
 * Example endpoint demonstrating error handling
 * @route GET /api/test/error
 * @returns {Object} Error response
 * @throws {Error} 400 - Example error
 */
export const getTestError = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Simulate an error
    throw new Error('This is a test error');
  } catch (error) {
    next(error);
  }
};

/**
 * Example endpoint with parameters and validation
 * @route GET /api/test/hello/:name
 * @param {string} name.path.required - Name to greet
 * @returns {Object} Greeting message
 * @throws {Error} 400 - Missing name parameter
 */
export const getHello = async (
  req: Request<{ name: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.params;

    if (!name) {
      res.status(400).json(createErrorResponse('Name parameter is required', 400));
      return;
    }

    res.status(200).json(
      createSuccessResponse({
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (error) {
    next(error);
  }
};
