// models/pdfModel.js

const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  url: String, // URL of the generated PDF
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pdf', pdfSchema);
