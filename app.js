const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { SECRET_KEY } = require("./data/key");
const { verify } = require("./middleware/auth");
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
require("./models/db/userSchema");
require("./models/db/productSchema");
const User = mongoose.model("Users");
const Item = mongoose.model("Items");
const upload = multer({ dest: "uploads/" });

const DB =
  "mongodb+srv://smshoaib2001:restaurant@cluster0.z84wdbi.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to mongoDB"))
  .catch((e) => console.log(e));

app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/itemRouter"));

// app.post("/register", async (req, res) => {
//   const { userName, address, phoneNumber, email, password } = req.body;
//   console.log("body data: ", req.body);
//   const encryptedPassword = await bcrypt.hash(password, 10);
//   try {
//     const oldUser = await User.findOne({ email });
//     if (oldUser) {
//       return res.json({ error: "User Exists" });
//     }
//     await User.create({
//       email,
//       password: encryptedPassword,
//     });
//     res.send({ status: "ok user created" });
//   } catch (error) {
//     res.send({ status: "error" });
//   }
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.json({ error: "User Not found" });
//   }
//   if (await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign({ email: user.email }, SECRET_KEY, {
//       expiresIn: "1hr",
//     });

//     if (res.status(201)) {
//       return res.json({ status: "ok", data: token });
//     } else {
//       return res.json({ error: "error" });
//     }
//   }
//   res.json({ status: "error", error: "InvAlid Password" });
// });

app.post("/home", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    await User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.post("/dashboard", upload.single("itemImage"), async (req, res) => {
  const { itemTitle, itemCategory, itemDescription, itemPrice, itemImage } =
    req.body;
  console.log("body data: " + req);
  const itemImg = req.file.path;
  try {
    const oldItem = await Item.findOne({ itemTitle });
    if (oldItem) {
      return res.json({ error: "Item already added" });
    }
    await Item.create({
      itemTitle,
      itemCategory,
      itemDescription,
      itemPrice,
      itemImage: itemImg,
    });
    res.send({ status: "ok item added" });
  } catch (error) {
    res.send({ status: "error item could not be added" });
  }
});

app.listen(4000, () => {
  console.log("Server started");
});
