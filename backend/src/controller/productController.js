import { Product } from "../models/productModel.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// TODO: create controller endpoints for products


const addProduct = asyncHandler(async (req, res) => {
  // Define the expected fields
  const expectedFields = ['productId', 'productName', 'units', 'salePrice', 'purchasePrice', 'productImageURL', 'minimumQuantity', 'category'];

  // Check if all expected fields are present in the request body
  if (!expectedFields.every(field => Object.keys(req.body).includes(field))) {
    throw new apiError(400, "All fields are required");
  }

  const { productId, productName, units, salePrice, productImageURL, purchasePrice, minimumQuantity, category } = req.body;

  const productExists = await Product.findOne({ $or: [{ productId }, { productName }] });
  if (productExists) {
    throw new apiError(409, "Product with that id or name already exists");
  }
  const product = await Product.create({ productId, productName, units, productImageURL, salePrice, purchasePrice, minimumQuantity, category });
  const createdProduct = await Product.findById(product._id);
  return res.status(201).json(new ApiResponse(201, createdProduct, "Product added successfully"));
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id.toString().trim() === "")
    throw new apiError(400, "id required");
  const product = await Product.findById(id);

  if (!product)
    throw new apiError(404, "product not found");

  return res.status(200).json(new ApiResponse(200, product, "product fetched successfully"));
})

const updateProduct = asyncHandler(async (req, res) => {
  const expectedFields = ['_id', 'productId', 'productName', 'units', 'salePrice', 'purchasePrice', 'minimumQuantity', 'category'];

  if (!expectedFields.every(field => Object.keys(req.body).includes(field))) {
    throw new apiError(400, "All fields are required");
  }

  const { _id, productId, productName, productImageURL, units, salePrice, purchasePrice, minimumQuantity, category } = req.body;

  const product = await Product.findById(_id);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  // Update the product
  const updatedProduct = await product.updateOne({
    $set: {
      productId,
      productImageURL,
      productName,
      units,
      salePrice,
      purchasePrice,
      minimumQuantity,
      category
    }
  });

  if (!updatedProduct.matchedCount || !updatedProduct.modifiedCount) {
    throw new apiError(500, "Failed to update product");
  }
  // reload updated product

  const productRefreshed = await Product.findById(_id);
  return res.status(200).json(new ApiResponse(200, productRefreshed, "Product updated successfully"));

});


const getLowProducts = asyncHandler(async (_, res) => {
  try {
    // Using the aggregation framework to find products with units less than minimumQuantity
    const products = await Product.aggregate([
      {
        $match: {
          $expr: {
            $lt: ["$units", "$minimumQuantity"]
          }
        }
      }
    ]);

    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong while fetching low stock products");
  }
});


const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body
  if (_id.toString().trim() === "")
    throw new apiError(400, "id required");
  const product = await Product.findByIdAndDelete(_id);
  return res.status(200).json(new ApiResponse(200, product, "product deleted successfully"))
})

const getAllProducts = asyncHandler(async (_, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    throw new apiError(500, "Something went wrong while fetching products");
  }
});

export { getLowProducts, updateProduct, addProduct, getProduct, getAllProducts, deleteProduct };
