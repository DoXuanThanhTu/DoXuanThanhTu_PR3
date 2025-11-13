import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Access denied" });
  }
};
