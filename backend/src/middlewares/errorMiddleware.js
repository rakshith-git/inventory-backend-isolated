import { apiError } from "../utils/apiError.js";
export const errorHandlerMiddleware = (err, _, res, next) => {
  if (err instanceof apiError) {
    // Handle API-specific errors here"hello"
    console.log(err);
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
    });
  } else {
    // Handle other types of errors
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
