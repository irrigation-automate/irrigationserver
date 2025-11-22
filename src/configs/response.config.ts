import { Request, Response, NextFunction } from "express";
import {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createPaginatedResponse,
} from "../utils/responseHelpers";
import { ErrorDetails } from "@/utils/responseHelpers";

export function responseMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res.success = function <T>(data: T, message?: string) {
    return res.json(createSuccessResponse(data, message));
  };

  res.error = function <T extends ErrorDetails>(
    message: string,
    status = 500,
    details?: T,
  ) {
    return res
      .status(status)
      .json(createErrorResponse(message, status, details));
  };

  res.validationError = function (errors: Record<string, string[]>) {
    return res.status(400).json(createValidationErrorResponse(errors));
  };

  res.paginated = function <T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message?: string,
  ) {
    return res.json(
      createPaginatedResponse(items, total, page, limit, message),
    );
  };

  next();
}
