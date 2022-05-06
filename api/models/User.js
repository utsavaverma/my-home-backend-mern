// Author: Harsh Bhatt (B00877053)

const { Schema, model } = require("mongoose");
const { ROOM_SEEKER, ROOM_OWNER, SUPER_ADMIN } = require("../config/constants");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: ROOM_SEEKER,
      enum: [ROOM_SEEKER, ROOM_OWNER, SUPER_ADMIN],
    },
    status:{
      type: Boolean,
      default: true
    },
    gender: {
      type: String,
      default: "prefer_not_to_say",
      enum: ["male", "female", "prefer_not_to_say"],
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("user", UserSchema);
