import { Router } from "express";
import { addProduct, getLowProducts, getAllProducts, deleteProduct, getProduct, updateProduct } from "../controller/productController.js";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js"
import { checkIfUserExists } from "../middlewares/authMiddlewares.js";
const router = Router();

router.route("/create").post(checkIfUserExists, addProduct, errorHandlerMiddleware);
router.route("/getall").get(checkIfUserExists, getAllProducts, errorHandlerMiddleware);
router.route("/getlow").get(checkIfUserExists, getLowProducts, errorHandlerMiddleware);
router.route("/get/:id").get(checkIfUserExists, getProduct, errorHandlerMiddleware);
router.route("/update").put(checkIfUserExists, updateProduct, errorHandlerMiddleware);
router.route("/delete").delete(checkIfUserExists, deleteProduct, errorHandlerMiddleware);
export default router;
