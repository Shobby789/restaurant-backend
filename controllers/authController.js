require("../models/db/userSchema");
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../data/key");

module.exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("body data: ", req.body);
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ status: "User Already Exists" });
    }
    await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "Registerd successfully" });
  } catch (error) {
    res.send({ status: "Register failed" });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1hr",
    });

    if (res.status(201)) {
      // res.redirect("/home");
      return res.json({ status: "Ok", data: { user, token } });
    } else {
      return res.json({ error: "Login failed" });
    }
  }
  res.json({ status: "Invalid email or password", error: "InvAlid Password" });
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const allCustomers = await User.find();
    res.status(200).json(allCustomers);
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    // console.log("email & newPass >> ", email + " ", newPassword);
    const findUser = User.findOne({ email });
    if (!findUser) {
      res.send({ status: "Email does not exist" });
    } else {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(email, { password: encryptedPassword });
      res.json({ status: "Password Reset Successully" });
    }
  } catch (error) {
    console.log("resetPassword error >> ", error);
    res.send({ status: "Some error occurred" });
  }
};
