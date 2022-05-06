var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
const mongoose= require('mongoose');
const Property = require("../models/Property");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

const getPropertyDetailsController = async (req, res) => {
    try {
        const result = await Property.find({});
        console.log(result);
        return res.status(200).json(result);
    }catch(e) {
        console.log(e)
        return res.status(500).json({
            message: "An error occurred",
            success: false,
          });
    }

}

module.exports = {getPropertyDetailsController}
