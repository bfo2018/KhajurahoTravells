import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

export async function protect(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid token"));
  }
}

export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user || null;
  } catch {
    req.user = null;
  }

  next();
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
}
