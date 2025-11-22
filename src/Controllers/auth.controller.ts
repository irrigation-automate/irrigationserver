import { Request, Response, NextFunction } from "express";
import authService from "../Services/auth.service";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../utils/responseHelpers";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.registerUserService(req.body);

      if (!result.success) {
        res
          .status(400)
          .json(
            createErrorResponse(result.error || "Registration failed", 400),
          );
        return;
      }

      const rawUser = result.user as any;
      const user =
        rawUser && typeof rawUser.toJSON === "function"
          ? rawUser.toJSON()
          : rawUser;
      if (user && user.password) delete user.password;

      res
        .status(201)
        .json(createSuccessResponse(user, "User registered successfully"));
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
