const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const router = express.Router();
require("../models/db/productSchema");
require("../models/db/orderSchema");
const path = require("path");
const { deleteItem, editItem } = require("../controllers/itemController");
const Item = mongoose.model("Items");
const Orders = mongoose.model("Orders");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
router.use(express.static(__dirname + "./public/"));

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

// upload.single("image"),
router.post("/addItem", upload.single("itemImage"), async (req, res) => {
  const { itemTitle, itemDescription, itemCategory, itemPrice } = req.body;
  const { filename } = req.file;
  //   console.log("req.body: ", req.body);
  //   console.log("ItemImage: " + filename);

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
});

router.get("/getItems", async (req, res) => {
  try {
    const food_items = await Item.find({});
    // const food_images = await ItemImages.find({});
    // const categories = await CategoryItems.find({});
    res.send({ status: "ok got all items", data: food_items });
  } catch (error) {
    res.send({
      status: "error",
      error: "Server error items could not fetched",
    });
  }
});

router.delete("/deleteItem/:_id", async (req, res) => {
  const { _id } = req.params._id;
  console.log(_id);
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params._id);
    if (!deletedItem) {
      res.send({ status: "item not found", data: "error" });
    } else {
      res.send({ status: "Item deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get(`/editItem/:_id`, (req, res) => {
  try {
    const { _id } = req.params._id;
    console.log(_id);
  } catch (error) {
    console.log("editItem api error >> ", error);
  }
});

router.post("/placeOrder", async (req, res) => {
  const {
    customerId,
    customerAddress,
    orderedItems,
    orderAmount,
    status,
    date,
  } = req.body;
  try {
    await Orders.create({
      customerId,
      customerAddress,
      orderedItems,
      orderAmount,
      status,
      date,
    });
    res.status(200).send({ status: "Order Placed Successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("Ordered Items api >> ", error);
  }
});

router.post("/getMyOrders", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("getMyOrders userId >>> ", userId);
    const myOrders = await Orders.find({});
    const userOrder = myOrders.map((order) => {
      if (order.customerId == userId) {
        return order;
      } else {
        return "No Orders Found";
      }
    });
    res.status(200).json(userOrder);
  } catch (error) {
    res.status(400).send({ error: error });
    console.log("getMyOrders error >> ", error);
  }
});

router.get("/getOrders", async (req, res) => {
  try {
    const orders = await Orders.find();
    const reversedArr = orders.reverse();
    res.status(200).json(reversedArr);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// accept / reject order
router.put("/order/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const { status } = req.body;
    // console.log("_id and status >> ", _id + " / " + status);
    const updatedOrder = await Orders.findByIdAndUpdate(
      _id,
      { status: status },
      {
        returnOriginal: false,
      }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("userOrder to update api error >> ", error);
  }
});

router.post("/fetchBurgers", async (req, res) => {
  try {
    const { category } = req.body;
    // console.log("Category >> ", category);
    const food_items = await Item.find({});
    const filteredItems = food_items.filter((item) => {
      return item.itemCategory == category;
    });
    res.status(200).send(filteredItems);
  } catch (error) {
    res.status(400).send({ error: error });
    console.log("fetchBurgers error >> ", error);
  }
});

module.exports = router;
