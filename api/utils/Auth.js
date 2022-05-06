// Author: Harsh Bhatt (B00877053)

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET, SALT_VALUE, CLIENT_BASE_URL } = require("../config");
const passport = require("passport");
const { sendEmail } = require("./sendEmail");
const { ROOM_SEEKER, ROOM_OWNER, SUPER_ADMIN } = require("../config/constants");

const userRegister = async (user, role, res) => {
  try {
    // Validate the user
    let usernameTaken = await validateUsername(user.username);
    if (usernameTaken) {
      return res.status(400).json({
        message: "Username is already taken",
        success: false,
      });
    }

    let emailTaken = await validateEmail(user.email);
    if (emailTaken) {
      return res.status(400).json({
        message: "Email is already taken",
        success: false,
      });
    }

    const password = await bcrypt.hash(user.password, Number(SALT_VALUE));
    const userObj = {
      ...user,
      password,
      role,
    };

    if (role == ROOM_SEEKER || role == SUPER_ADMIN) {
      let verificationToken = jwt.sign(userObj, SECRET, { expiresIn: "1h" });
      const link = `${CLIENT_BASE_URL}/activate-account/${verificationToken}`;
      const mailRes = sendEmail(
        user.email,
        "Activate your account - My Home",
        {
          name: user.firstName,
          link,
        },
        "../utils/template/activateAccount.handlebars"
      );

      if (mailRes) {
        return res.status(200).json({
          message: "Email has been sent! Please activate your account",
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "An error occurred while sending an email",
          success: false,
        });
      }
    }

    if (role == ROOM_OWNER) {
      const newRoomOwner = new User(userObj);
      await newRoomOwner.save();

      sendEmail(
        user.email,
        "Welcome - Account created - My Home",
        {
          name: user.firstName,
        },
        "../utils/template/welcomeRoomOwner.handlebars"
      );

      return res.status(201).json({
        message: "User is registered successfully!",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to create user account",
      success: false,
    });
  }
};

const userLogin = async (userCreds, role, res) => {
  let { usernameOrEmail, password } = userCreds;

  // Check if user exists in database or not
  const user = await User.findOne({
    $or: [
      {
        email: usernameOrEmail,
      },
      {
        username: usernameOrEmail,
      },
    ],
  });

  if (!user) {
    return res.status(404).json({
      message: "Username or Email does not exist",
      success: false,
    });
  }

  // Check role of the user
  if (user.role !== role) {
    return res.status(403).json({
      message: "You are not authorized to perform this operation!",
      success: false,
    });
  }

  if (!user.accountVerified) {
    return res.status(400).json({
      message: "Your account is not yet verified",
      success: false,
    });
  }

  // It means user exists and accessing correct content
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const loggedInUser = {
      user_id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountVerified: user.accountVerified,
      role: user.role,
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      address: user.address,
      city: user.city,
      province: user.province,
      postalCode: user.postalCode,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
    // Issue the token
    let token = jwt.sign(loggedInUser, SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      token,
      message: "Login successful",
      success: true,
    });
  } else {
    return res.status(401).json({
      message: "Invalid credentials",
      success: false,
    });
  }
};

const changePassword = async (reqObj, res) => {
  try {
    const { oldPassword, newPassword, userId } = reqObj;
    let user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
      const password = await bcrypt.hash(newPassword, Number(SALT_VALUE));
      user.password = password;
      await user.save();

      return res.status(200).json({
        message: "Password changed successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "You have entered the wrong password",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to change user password",
      success: false,
    });
  }
};

const verifyAccount = async (token, res) => {
  try {
    jwt.verify(token, SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid link or expired",
          success: false,
        });
      }

      // Validate the user
      let usernameTaken = await validateUsername(decodedToken.username);
      if (usernameTaken) {
        return res.status(400).json({
          message: "Username is already taken",
          success: false,
        });
      }

      let emailTaken = await validateEmail(decodedToken.email);
      if (emailTaken) {
        return res.status(400).json({
          message: "Email is already taken",
          success: false,
        });
      }

      const newUser = new User({
        ...decodedToken,
        accountVerified: true,
      });

      await newUser.save();

      sendEmail(
        decodedToken.email,
        "Welcome - Account created - My Home",
        {
          name: decodedToken.firstName,
        },
        "../utils/template/welcome.handlebars"
      );

      return res.status(201).json({
        message: "User is registered successfully",
        success: true,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create user account",
      success: false,
    });
  }
};

const fetchProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user._id.toString());
    return res.status(200).json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      gender,
      address,
      city,
      province,
      postalCode,
    } = req.body;
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to perform this operation!",
        success: false,
      });
    }
    const user = await getUserById(userId);
    const updatedUserData = {
      ...user._doc,
      firstName,
      lastName,
      phoneNumber,
      gender,
      address,
      city,
      province,
      postalCode,
    };

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          ...updatedUserData,
        },
      }
    );
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: serializeUser(updatedUserData),
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? true : false;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? true : false;
};

const getUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * @DESC Passport middleware
 */

const verifyUser = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check role middleware
 */

const checkRoles = (roles) => (req, res, next) => {
  !roles.includes(req.user.role)
    ? res.status(403).json({
        message: "You are not authorized to perform this operation!",
        success: false,
      })
    : next();
};

const serializeUser = (user) => {
  return {
    user_id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountVerified: user.accountVerified,
    role: user.role,
    gender: user.gender,
    username: user.username,
    phoneNumber: user.phoneNumber,
    address: user.address,
    city: user.city,
    province: user.province,
    postalCode: user.postalCode,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  userRegister,
  userLogin,
  changePassword,
  verifyAccount,
  verifyUser,
  serializeUser,
  checkRoles,
  fetchProfile,
  updateUser,
};
