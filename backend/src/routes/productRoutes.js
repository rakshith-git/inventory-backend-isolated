import { Router } from "express";
import { addProduct, getAllProducts, getProduct } from "../controller/productController.js";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js"
import { checkIfUserExists } from "../middlewares/authMiddlewares.js";
const router = Router();

router.route("/create").post(checkIfUserExists, addProduct, errorHandlerMiddleware);
router.route("/getall").get(checkIfUserExists, getAllProducts, errorHandlerMiddleware);
router.route("/get").get(checkIfUserExists, getProduct, errorHandlerMiddleware);
export default router;
