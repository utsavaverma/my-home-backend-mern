// Author: Sai Vaishnavi Jupudi (B00873534)

const User = require("../models/User");
const Cart = require("../models/Cart");
const Property = require("../models/Property");
const { CLIENT_BASE_URL, SALT_VALUE } = require("../config");
const Booking = require("../models/Booking");
const mongoose= require('mongoose');
const {
  BOOKING_STATUS_PENDING,
  BOOKING_STATUS_CONFIRMED,
  BOOKING_STATUS_FAILED,
  BOOKING_STATUS_CANCELLED,
  CART_PAYMENT_PENDING,
  CART_PAYMENT_APPROVED
} = require("../config/constants");


const createbookingController = async (req, res) => {
  try {
    let cartId=req.body.cartId;
    console.log(req.body.cartId);
    cartId = mongoose.Types.ObjectId(cartId);
    const userId=mongoose.Types.ObjectId(req.user._id.toString());

    console.log('booking')
    let cart=await Cart.findOne({cartId,cartPaymentStatus:CART_PAYMENT_PENDING});
    console.log(cart)
    let bookingAmount=0;
    cart.cartItems.forEach(element => {
      bookingAmount+=element.calculatedRent;
    });

    console.log(bookingAmount)
    let booking=new Booking({
        userId,
        propertyItems:cart.cartItems,
        status:BOOKING_STATUS_CONFIRMED,
        bookingAmount
    })

    const result=await booking.save();
    cart.cartPaymentStatus=CART_PAYMENT_APPROVED;
    await cart.save();

    res.status(200).send(result);
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const cancelbookingController = async (req, res) => {
    try {
  
      //const bookingId=req.body.bookingId;
      const userId=mongoose.Types.ObjectId(req.user._id.toString());
      const bookingId=mongoose.Types.ObjectId(req.body.bookingId);
      const booking=await Booking.findOne({_id:req.body.bookingId,status:BOOKING_STATUS_CONFIRMED});
      booking.status=BOOKING_STATUS_CANCELLED;
      const result=await booking.save();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred",
        success: false,
      });
    }
  };

  const getbookingByUserController = async (req, res) => {
    try {
  
      const userId=mongoose.Types.ObjectId(req.user._id.toString());
      const booking=await Booking.find({userId,status:BOOKING_STATUS_CONFIRMED});
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred",
        success: false,
      });
    }
  };

module.exports = {
    createbookingController,
    cancelbookingController,
    getbookingByUserController
};
