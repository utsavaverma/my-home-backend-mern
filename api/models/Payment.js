// Author: Harsh Bhatt (B00877053)

const { Schema, model } = require("mongoose");
const {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_SUCCESS,
  PAYMENT_STATUS_FAILED,
} = require("../config/constants");

const PaymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    transactionId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: PAYMENT_STATUS_PENDING,
      enum: [
        PAYMENT_STATUS_PENDING,
        PAYMENT_STATUS_SUCCESS,
        PAYMENT_STATUS_FAILED,
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("payment", PaymentSchema);
