const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema(
  {
    itemTitle: { type: String, required: true, unique: true },
    itemDescription: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemCategory: { type: String },
    itemImage: { type: String, required: true },
  },
  {
    collection: "Items",
  }
);

mongoose.model("Items", itemsSchema);
