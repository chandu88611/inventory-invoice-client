const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");

const { createCustomer, getCustomers } = require("../controllers/customerController");

  router.post("/",protect,  createCustomer);
  router.get("/get-all-customers",protect, getCustomers);

  module.exports = router;