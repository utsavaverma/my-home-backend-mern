// Author: Harsh Bhatt (B00877053)

const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const { DB } = require("./api/config");

//! Routes
const usersRouter = require("./api/routes/users");
const passwordResetRouter = require("./api/routes/passwordReset");
const alluserRouter = require("./api/routes/superadmin");
const bookingRoute = require("./api/routes/bookingConfirmation");
const getPropertyRoute = require("./api/routes/getPropertyDetails");

//Namit
const cartRouter = require("./api/routes/cart");

//Utsava
const propertyRouter = require("./api/routes/propertyRoutes");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// Connection with database
const connect = mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => {
    console.log("Connected Successfully");
  },
  (err) => console.log(err)
);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/uploads", express.static(path.join(__dirname, "api/uploads")));

require("./api/middlewares/passport")(passport);

app.use("/api/users", usersRouter);
app.use("/api/password-reset", passwordResetRouter);

//Namit
app.use("/api/cart", cartRouter);

//Utsava
app.use("/api/property-routes", propertyRouter);
// Vaishnavi

app.use("/api/booking", bookingRoute);
app.use("/api/getProperty", getPropertyRoute);

// Utsava

// Add routes here

// Arun

app.use("/api/superadmin", alluserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
