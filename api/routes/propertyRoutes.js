// Author: Utsava Verma (B00873273)
const { verifyUser, serializeUser, checkRoles } = require("../utils/Auth");
const { ROOM_OWNER } = require("../config/constants");
const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
var ObjectId = require("mongodb").ObjectID;
const SERVER_BASE_URL = require('../config/index');
let RentalPropertyModel = require("../models/Property");
let PropertyAddress = require("../models/PropertyAddress");

const propertyCollectionName = RentalPropertyModel.modelName;
const addressCollectionName = PropertyAddress.modelName;
const { collection, db } = require("../models/Property");
const { check } = require("express-validator");
const { env } = require("process");

//Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
    return cb(new Error("You can upload only image files!"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

//POST request to add new rental property to database
router.post(
  "/add-rental-property",
  verifyUser,
  checkRoles([ROOM_OWNER]),
  upload.array("propertyImage", 10),
  async (req, res) => {
  
    console.log(req.body);
    const propertyTitle = req.body.propertyTitle;
    const amenities = req.body.amenities;
    const availableRooms = req.body.availableRooms;
    const totalRooms = req.body.totalRooms;
    const availabilityStartDate = req.body.availabilityStartDate;
    const rent = req.body.rent;
    const unitNo = req.body.unitNo;
    const address = req.body.address;
    const city = req.body.city;
    const province = req.body.province;
    const postalCode = req.body.postalCode;
    const type = req.body.type;
    const createdBy = mongoose.Types.ObjectId(req.user._id.toString());
    const propertyPictures = req.files;
    //console.log(propertyPictures);
    const imagePaths = [];
    

    let imageBaseUrl = `${SERVER_BASE_URL.SERVER_BASE_URL}/uploads/`;
    
    for (let i = 0; i < propertyPictures.length; i++) {
      imagePaths[i] = imageBaseUrl + propertyPictures.at(i).filename;
    }

    //save address details in 'property_address' collection
    const newRentalPropertyAddress = new PropertyAddress({
      unitNo: unitNo,
      address: address,
      city: city,
      province: province,
      postalCode: postalCode,
    });

    const result = await db
      .collection(addressCollectionName)
      .insertOne(newRentalPropertyAddress);

    let insertedAddressId = result.insertedId;

   

    //save other details of the new property in 'property' collection
    const newRentalProperty = new RentalPropertyModel({
      createdBy: createdBy,
      address: insertedAddressId,
      //status: ,
      type: type,
      propertyTitle: propertyTitle,
      amenities: amenities,
      availableRooms: availableRooms,
      totalRooms: totalRooms,
      availabilityStartDate: availabilityStartDate,
      rent: rent,
      propertyPictures: imagePaths,
    });

    await db.collection(propertyCollectionName).insertOne(newRentalProperty);

    res.send({ status: true, data: result });
  }
);

//GET request to get rental properties of the logged-in user from the database
router.get(
  "/get-rental-properties",
  verifyUser,
  checkRoles([ROOM_OWNER]),
  async (req, res) => {
    try {
      const createdBy = mongoose.Types.ObjectId(req.user._id.toString());
      const propertyData = await RentalPropertyModel.find({createdBy:createdBy}).populate("address");
      console.log(propertyData);
      res.send(propertyData);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

//GET request to get rental property based on property id from the database
router.get(
  "/get-rental-property/:id",
  verifyUser,
  checkRoles([ROOM_OWNER]),
  async (req, res) => {
    
    const id = req.params.id;

    try {
      const foundProperty = await RentalPropertyModel.findOne({
        _id: id,
      }).populate("address");
      console.log(foundProperty);
      res.send(foundProperty);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

//DELETE request to delete a rental property of the user from the database
router.delete(
  "/delete-rental-property/:_id",
  verifyUser,
  checkRoles([ROOM_OWNER]),
  async (req, res) => {
    let id = req.params._id;
    console.log(id);

    //delete the 'property' document first and then delete the related 'property address' document
    try {
      
      let deletedProperty = await RentalPropertyModel.findByIdAndRemove(id, {
        projection: "address",
      });

      await PropertyAddress.deleteOne({ _id: deletedProperty.address });
      res.status(200).send({ message: "property deleted" });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

module.exports = router;

//PUT request to update a rental property of the user
router.put(
  "/update-rental-property/:id",
  verifyUser,
  checkRoles([ROOM_OWNER]),
  async (req, res) => {
    const propertyId = req.params.id;
    console.log(propertyId);
    const updatedDetails = req.body;
    //console.log(updatedDetails);

    try {
      const result = await RentalPropertyModel.findByIdAndUpdate(
        propertyId,
        updatedDetails
      );

      const propertyData = await RentalPropertyModel.findOne({
        _id: propertyId,
      });

      res.send({ propertyData });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

module.exports = router;
