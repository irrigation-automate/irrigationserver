import {
  Request,
  Express,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

class MainController {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  /**
   * 404 Not Found handler
   */
  public notFound() {
    this.app.use((_req: Request, res: Response) => {
      return res.error(
        _req.t("response.not_found", { ns: "translation" }),
        404,
      );
    });
  }

  /**
   * Global Express error handler
   */
  public errorResponse() {
    this.app.use(this.errorHandler);
  }

  /**
   * Error Middleware
   */
  private errorHandler: ErrorRequestHandler = (
    err: Error & { errors?: Record<string, { message: string }> },
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (res.headersSent) {
      return next(err);
    }
    if (err.name === "ValidationError") {
      const errorDetails = err.errors
        ? Object.fromEntries(
            Object.entries(err.errors).map(([key, value]) => [
              key,
              [value.message],
            ]),
          )
        : {};

      return res.validationError(errorDetails);
    }

    return res.error(
      _req.t("response.server_error", { ns: "translation" }),
      500,
      process.env.NODE_ENV === "development"
        ? { message: err.message, stack: err.stack }
        : undefined,
    );
  };
}

const mainController = (app: Express) => new MainController(app);
export default mainController;
