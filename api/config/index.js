// Author: Harsh Bhatt (B00877053)

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  SECRET: process.env.APP_SECRET,
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  EMAIL_USER: process.env.APP_EMAIL_USER,
  EMAIL_PASSWORD: process.env.APP_EMAIL_PASSWORD,
  EMAIL_HOST: process.env.APP_EMAIL_HOST,
  EMAIL_SERVICE: process.env.APP_EMAIL_SERVICE,
  SERVER_BASE_URL: process.env.APP_SERVER_BASE_URL,
  CLIENT_BASE_URL: process.env.APP_CLIENT_BASE_URL,
  SALT_VALUE: process.env.APP_SALT_VALUE,
};
