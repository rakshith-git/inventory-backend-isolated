import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
export const checkIfUserExists = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const decodedUser = await User.findById(decodedToken._id).select(
      "-username -email -refreshToken",
    );
    if (!decodedUser) {
      throw new apiError(401, "Unauthorized");
    }
    req.user = decodedUser;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Unauthorized");
  }
});
