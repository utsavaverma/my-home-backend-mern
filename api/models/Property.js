// Author: Harsh Bhatt (B00877053)
const { Schema, model } = require("mongoose");
const {
  PROPERTY_PENDING,
  PROPERTY_APPROVED,
  PROPERTY_REJECTED,
  PROPERTY_AS_ROOM,
  PROPERTY_AS_HOUSE,
} = require("../config/constants");
const PropertySchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    address: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "property_address",
    },
    status: {
      type: String,
      default: PROPERTY_PENDING,
      enum: [PROPERTY_PENDING, PROPERTY_APPROVED, PROPERTY_REJECTED],
    },
    type: {
      type: String,
      default: PROPERTY_AS_ROOM,
      enum: [PROPERTY_AS_HOUSE, PROPERTY_AS_ROOM],
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    amenities: {
      type: String,
    },

    availableRooms: {
      type: String,
      required: true,
    },
    totalRooms: {
      type: String,
      required: true,
    },
    availabilityStartDate: {
      type: Date,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    propertyPictures: [{ type: String }],
    // reviews: [
    //   {
    //     userId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "user",
    //     },
    //     review: String,
    //   },
    // ]
    // ,
  },
  { timestamps: true }
  
);

const Property = model("property", PropertySchema, "property");
module.exports = Property;
