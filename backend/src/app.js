import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiError } from "./utils/apiError.js";
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true })); // Allows to send form data. If I don't add this, I won't be able to send data..

//import routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import demoRoutes from './routes/demoRoutes.js'
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use('', demoRoutes)
export default app;
