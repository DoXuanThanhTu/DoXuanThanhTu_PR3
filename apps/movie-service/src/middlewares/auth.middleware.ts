import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Ưu tiên: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Thứ hai: header `token` thuần
    if (!token && req.headers.token) {
      token = String(req.headers.token);
    }

    if (!token) {
      req.user = undefined;
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    // Xác minh token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured in environment");
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
authMiddleware.optional = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
    } catch {
      // nếu token lỗi thì bỏ qua, xem như khách
    }
  }
  next();
};
