const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: false },
    customerAddress: { type: String, required: true },
    orderedItems: { type: Array, required: true },
    orderAmount: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: String, required: true },
  },
  {
    collection: "Orders",
  }
);

mongoose.model("Orders", orderSchema);
