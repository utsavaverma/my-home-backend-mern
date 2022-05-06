// Author: Harsh Bhatt (B00877053)

const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_SERVICE,
  EMAIL_HOST,
} = require("../config");

const sendEmail = async (email, subject, payload, template) => {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      service: EMAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);

    const mailRes = await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject,
      html: compiledTemplate(payload),
    });

    return mailRes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmail,
};
