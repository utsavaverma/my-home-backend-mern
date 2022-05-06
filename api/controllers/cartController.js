// Author: Namit Prakash Dadlani (B00873214)

const mongoose = require('mongoose');
const Cart = require("../models/Cart");
const RentalPropertyModel = require("../models/Property");

const {
    CART_PAYMENT_PENDING
} = require("../config/constants");

// getAllCartItems: Retrieve all the carts for debugging and testing.
const getAllCartItems = (req, res) => {
    Cart
        .find()
        .exec()
        .then((cartItems) => {
            return res.status(200).json({
                message: "Cart items retrieved",
                success: true,
                cartItems: cartItems
            });
        })
        .catch((error) => {
            console.log((error) => {
                return res.status(500).json({
                    message: "Internal server error.",
                    success: false,
                });
            });
        });
};

// getUserCartItems: Retrieve only logged in user's cart details.
const getUserCartItems = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.user._id.toString());
    try {
        await Cart
            .findOne({ "userId": userId, cartPaymentStatus: CART_PAYMENT_PENDING })
            .exec()
            .then((cartItems) => {
                return res.status(200).json({
                    message: "Cart items retrieved",
                    success: true,
                    cartItems: cartItems
                })
                    .end();
            })
            .catch((error) => {
                console.log((error) => {
                    return res.status(500).json({
                        message: "Internal server error.",
                        success: false,
                    });
                });
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

// addToCart: Add item to cart.
const addToCart = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user._id.toString());
        let {
            property,
            fromDate,
            toDate,
            noOfOccupants,
            calculatedRent
        } = req.body

        let fetchedCart = await Cart.findOne({ userId, cartPaymentStatus: CART_PAYMENT_PENDING });

        const newCartItem = {
            property,
            fromDate,
            toDate,
            noOfOccupants,
            calculatedRent
        }

        if (fetchedCart) {
            fetchedCart.cartItems.push(newCartItem)
            await fetchedCart.save();

            return res.status(200).json({
                message: "Item added to existing cart.",
                success: true,
            });

        } else {
            const newCartForUser = await Cart.create({
                userId,
                cartItems: newCartItem,
                totalRent: 0,
                convenienceFee: 0,
                subTotal: 0,
                CART_PAYMENT_PENDING
            });
            await newCartForUser.save();

            return res.status(200).json({
                message: "New cart created for the user.",
                success: true,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred: Please call addToCart with all the required parameters.",
            description: error.message,
            success: false,
        });
    }
    
};

// deleteCartItem: Delete a specific item from cart.
const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const cartItemId = req.params.cartItemId;

        let fetchedCart = await Cart.findOne({ userId, cartPaymentStatus: CART_PAYMENT_PENDING });
        const cartList = fetchedCart.cartItems

        fetchedCart.cartItems = cartList.filter(item => {
            return item._id.toString() !== cartItemId })

        await fetchedCart.save();

        return res.status(200).json({
            message: "Delete successful.",
            success: true,
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred: Something went wrong.",
            description: error.message,
            success: false,
        });
    }
};

// setCartTotals: Set the price breakdown of cart.
const setCartTotals = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user._id.toString());
        let {
            totalRent,
            convenienceFee,
            subTotal
        } = req.body

        let fetchedCart = await Cart.findOne({ userId, cartPaymentStatus: CART_PAYMENT_PENDING });

        if (fetchedCart) {
            fetchedCart.totalRent = totalRent;
            fetchedCart.convenienceFee = convenienceFee;
            fetchedCart.subTotal = subTotal;
            await fetchedCart.save();
            return res.status(200).json({
                message: "Cart totals updated.",
                success: true,
            });
        } else {
            return res.status(404).json({
                message: "Error occurred: Cart not found for user.",
                description: error.message,
                success: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred: Couldn't update the cart totals.",
            description: error.message,
            success: false,
        });        
    }
}

// getCartTotals: Get the price breakdown of cart.
const getCartTotals = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.user._id.toString());

    await Cart
            .findOne({ "userId": userId, cartPaymentStatus: CART_PAYMENT_PENDING })
            .exec()
            .then((cartItems) => {
                return res.status(200).json({
                    message: "Cart items fetched",
                    success: true,
                    totalRent: cartItems.totalRent,
                    convenienceFee: cartItems.convenienceFee,
                    subTotal: cartItems.subTotal

                }).end();
            })
            .catch((error) => {
                console.log((error) => {
                    return res.status(500).json({
                        message: "Internal server error.",
                        success: false,
                    });
                });
            });
};

// getPropertyName: Retrieve property name for displaying in the cart.
const getPropertyName = async (req, res) => {
    const id = req.params.id;
    try {
      const foundProperty = await RentalPropertyModel.findOne({
        _id: id,
      });
      res.send(foundProperty);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
}

module.exports = {
    getAllCartItems,
    getUserCartItems,
    addToCart,
    deleteCartItem,
    setCartTotals,
    getCartTotals,
    getPropertyName
};