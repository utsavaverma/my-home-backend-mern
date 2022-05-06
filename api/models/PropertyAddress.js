// Author: Harsh Bhatt (B00877053)

const { Schema, model } = require("mongoose");

const PropertyAddressSchema = new Schema(
  {
    unitNo: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PropertyAddress = model(
  "property_address",
  PropertyAddressSchema,
  "property_address"
);
module.exports = PropertyAddress;
