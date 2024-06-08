import { Router } from "express";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js";
import { demo } from "../controller/demoController.js";
const router = Router();

router.route('').get(demo,errorHandlerMiddleware)
export default router;
