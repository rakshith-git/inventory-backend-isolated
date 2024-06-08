import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controller/userController.js";
import { checkIfUserExists } from "../middlewares/authMiddlewares.js";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js";
import { demo } from "../controller/demoController.js";
const router = Router();

router.route('').get(demo,errorHandlerMiddleware)
router.route("/register").post(registerUser, errorHandlerMiddleware);
router.route("/login").post(loginUser, errorHandlerMiddleware);
router
  .route("/logout")
  .post(checkIfUserExists, logoutUser, errorHandlerMiddleware);
router.route("/refresh-token").post(refreshAccessToken, errorHandlerMiddleware);
export default router;
