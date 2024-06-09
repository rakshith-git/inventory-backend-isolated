import mongoose, { Schema } from "mongoose";

const priceObj = {
  price: 0,
  isTaxed: false,
};
const productSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    productImageURL: { type: String, },

    units: { type: Number, default: 0 },

    salePrice: {
      type: Object,
      required: true,
      default: priceObj,
    },
    purchasePrice: {
      type: Object,
      required: true,
      default: priceObj,
    },

    location: { type: String },
    category: { type: String, required: true },
    minimumQuantity: { type: Number, default: 0 },
    lowOnStock: { type: Boolean, default: false },

  },
  { timestamps: true },
);

// TODO: create methods for product model

productSchema.pre("save", async function(next) {
  if (this.isModified("units")) {
    if (this.units <= this.minimumQuantity) this.lowOnStock = true;
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
