// Author: Harsh Bhatt (B00877053)

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ForgotPasswordToken = require("../models/ForgotPasswordToken");
const { CLIENT_BASE_URL, SALT_VALUE } = require("../config");
const { sendEmail } = require("../utils/sendEmail");

const sendResetLink = async (req, res) => {
  try {
    // Check if user exists in database or not
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    let token = await ForgotPasswordToken.findOne({ userId: user._id });
    if (!token) {
      token = await new ForgotPasswordToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${CLIENT_BASE_URL}/password-reset/${user._id}/${token.token}`;

    const mailRes = sendEmail(
      user.email,
      "Password reset - My Home",
      {
        name: user.firstName,
        link,
      },
      "../utils/template/requestResetPassword.handlebars"
    );

    if (mailRes) {
      return res.status(200).json({
        message: "Password reset link sent to your email account",
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "An error occurred while sending an email",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({
        message: "Invalid link or expired",
        success: false,
      });
    }

    const token = await ForgotPasswordToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).json({
        message: "Invalid link or expired",
        success: false,
      });
    }

    const password = await bcrypt.hash(req.body.password, Number(SALT_VALUE));
    user.password = password;
    await user.save();
    await token.delete();

    sendEmail(
      user.email,
      "Password changed - My Home",
      {
        name: user.firstName,
      },
      "../utils/template/resetPassword.handlebars"
    );

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

module.exports = {
  sendResetLink,
  resetUserPassword,
};
