import { Router } from "express";
import { addProduct, getAllProducts } from "../controller/productController.js";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js"

const router = Router();

router.route("/create").post(addProduct, errorHandlerMiddleware);
router.route("/getall").get(getAllProducts, errorHandlerMiddleware);
export default router;
