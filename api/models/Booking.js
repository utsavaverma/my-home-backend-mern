// Author: Harsh Bhatt (B00877053)

const { Schema, model } = require("mongoose");
const {
  BOOKING_STATUS_PENDING,
  BOOKING_STATUS_CONFIRMED,
  BOOKING_STATUS_FAILED,
  BOOKING_STATUS_CANCELLED
} = require("../config/constants");

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    propertyItems: [
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
    status: {
      type: String,
      default: BOOKING_STATUS_PENDING,
      enum: [
        BOOKING_STATUS_PENDING,
        BOOKING_STATUS_CONFIRMED,
        BOOKING_STATUS_FAILED,
        BOOKING_STATUS_CANCELLED
      ],
    },
    bookingAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("booking", BookingSchema);
