const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/getAllCustomers", getAllUsers);
router.put("/resetPassword", resetPassword);

module.exports = router;
