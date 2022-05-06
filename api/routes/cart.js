// Author: Namit Prakash Dadlani (B00873214)

const router = require("express").Router();

const {
  getAllCartItems,
  getUserCartItems,
  addToCart,
  deleteCartItem,
  setCartTotals,
  getCartTotals,
  getPropertyName,
} = require("../controllers/cartController");

const { verifyUser } = require("../utils/Auth");

// GET: View all items in the cart.

router.get("/viewAll", getAllCartItems);

// GET: View user's items in the cart.

router.get("/view", verifyUser, getUserCartItems);

// POST: Add item to the cart.

router.post("/add", verifyUser, addToCart);

// DELETE: Delete an item from the cart.

router.delete("/delete/:cartItemId", verifyUser, deleteCartItem);

// POST: Set the cost breakdown/cart totals.

router.post("/setCartTotals", verifyUser, setCartTotals);

// GET: get the cost breakdown/cart totals.

router.get("/getCartTotals", verifyUser, getCartTotals);

// GET: get the cost breakdown/cart totals.

router.get("/getPropertyName/:id", verifyUser, getPropertyName);

module.exports = router;
