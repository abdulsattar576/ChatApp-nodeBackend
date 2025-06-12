import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(
      new errorHandler("Authentication required. Please login.", 401)
    );
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = tokenData;
  next();
});
