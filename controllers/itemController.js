const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
require("../models/db/productSchema");
const Item = mongoose.model("Items");
router.use(express.static(__dirname + "./public/"));
const app = express();
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage, fileFilter });

module.exports.addItem = async (req, res) => {
  const { itemTitle, itemDescription, itemCategory, itemPrice } = req.body;
  const { filename } = req.file;
  console.log("req.body: ", req.body);
  console.log("ItemImage: " + filename);

  try {
    const oldItem = await Item.findOne({ itemTitle });
    if (oldItem) {
      return res.json({ error: "Item Exists" });
    }
    await Item.create({
      itemTitle,
      itemDescription,
      itemCategory,
      itemPrice,
      itemImage: filename,
    });

    res.send({ status: "item added" });
  } catch (error) {
    console.log("Error", error);
    res.send({ status: "item could not be added" });
  }
};

module.exports.editItem = async (req, res) => {
  // console.log("req:", req.params._id);
  let product = await Item.findOne({ _id: req.params._id });
  if (product) {
    res.send({ status: "ok", data: product });
  } else {
    res.send({ status: "item not found" });
  }
};

