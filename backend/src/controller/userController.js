import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/userModel.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(500, "something went wrong while validating tokens ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, gender, empId } = req.body;
  if (
    [username, email, password, gender, empId].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new apiError(400, "all fields are required");
  }
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    throw new apiError(409, "user with that email or username already exists");
  }
  const user = await User.create({ username, email, password, gender, empId });
  const createdUser = await User.findById(user._id).select("-password");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const options = { httpOnly: true, secure: false,sameSite: 'none', };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email)
    throw new apiError(400, "either username or email is required");

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new apiError(404, "user with that email or username doesnt exists");
  }
  const isValidUser = await user.isPasswordCorrect(password);
  if (!isValidUser) {
    throw new apiError(401, "invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { loggedUser }, "user logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { refreshToken: null } },
    { new: true },
  );
  const options = { httpOnly: true, secure: true };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const imcomingRefreshToken = req.cookies.refreshToken;
  if (!imcomingRefreshToken) throw new apiError(401, "Unauthorized request");
  const decodedToken = jwt.verify(
    imcomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decodedToken._id);
  if (!user) throw new apiError(401, "Unauthorized request");
  const options = { httpOnly: true, secure: true };
  if (imcomingRefreshToken !== user.refreshToken)
    throw new apiError(401, "refresh token expired");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "access token refreshed successfully"));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
