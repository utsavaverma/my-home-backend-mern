// Author: Harsh Bhatt (B00877053)

const { Schema, model } = require("mongoose");
const {
  CART_PAYMENT_PENDING,
  CART_PAYMENT_APPROVED,
  CART_PAYMENT_REJECTED,
} = require("../config/constants");

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    cartItems: [
      {
        property: {
          type: Schema.Types.ObjectId,
          ref: "property",
          required: true,
        },
        fromDate: {
          type: Date,
          required: true,
        },
        toDate: {
          type: Date,
          required: true,
        },
        noOfOccupants: {
          type: Number,
          required: true,
        },
        calculatedRent: {
          type: Number,
          required: true,
        },
      },
    ],
    totalRent: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    cartPaymentStatus: {
      type: String,
      default: CART_PAYMENT_PENDING,
      enum: [
        CART_PAYMENT_PENDING,
        CART_PAYMENT_APPROVED,
        CART_PAYMENT_REJECTED,
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("cart", CartSchema);
