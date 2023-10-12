const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { createDocument } = require("../controllers/documents/createDocument");
const { generatePDF } = require("../controllers/documents/generatePDF");


router.post("/",protect,  createDocument);
router.post("/generatepdf",protect,  generatePDF);




module.exports = router;