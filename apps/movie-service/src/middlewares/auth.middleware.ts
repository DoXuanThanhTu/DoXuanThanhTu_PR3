import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const extractToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  if (req.headers.token) {
    return String(req.headers.token);
  }
  return undefined;
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      req.user = undefined;
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured in environment");
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (err: any) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token expired"
        : err.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Unauthorized";

    return res.status(401).json({ message });
  }
};

authMiddleware.optional = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
      }
    } catch {}
  }

  next();
};
