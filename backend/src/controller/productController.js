import { Product } from "../models/productModel.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// TODO: create controller endpoints for products


const addProduct = asyncHandler(async (req, res) => {
  const { productId, productName, units, salePrice, purchasePrice, minimumQuantity, category } = req.body;

  if (
    [productId, productName, units, salePrice, purchasePrice, minimumQuantity, category].some(
      (field) => field.toString().trim() === "",
    ) ||
    [productId, productName, units, salePrice, purchasePrice, minimumQuantity, category].some(
      (field) => !field)
  ) {
    throw new apiError(400, "all fields are required");
  }

  const productExists = await Product.findOne({ $or: [{ productId }, { productName }] });
  if (productExists) {
    throw new apiError(409, "product with that id or name already exists");
  }
  const product = await Product.create({ productId, productName, units, salePrice, purchasePrice, minimumQuantity, category });
  const createdProduct = await Product.findById(product._id);
  return res.status(201).json(new ApiResponse(201, createdProduct, "product added successfully"));

})

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.body
  if (id.toString().trim() === "")
    throw new apiError(400, "id required");
  const product = await Product.findById(id);

  if (!product)
    throw new apiError(404, "product not found");

  return res.status(200).json(new ApiResponse(200, product, "product fetched successfully"));
})

const getAllProducts = asyncHandler(async (_, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    throw new apiError(500, "something went wrong while fetching products");
  }
});

export { addProduct, getProduct, getAllProducts };
