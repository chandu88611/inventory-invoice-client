const pdf = require("html-pdf");
const path = require("path");
const Pdf = require('../../models/pdfModel');

// const transporter = require("../../helpers/emailTransport.js");
// const emailTemplate = require("../../utils/pdf/emailTemplate.js");
const options = require("../../utils/pdf/options.js");
const pdfTemplate = require("../../utils/pdf/pdfTemplate.js");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const filepath = path.join(__dirname, "../../../docs/myDocument.pdf");


const dirname = path.resolve();

// const filepath = path.join(dirname, '../../../docs/myDocument.pdf');


// $-title   Generate document
// $-path    POST /api/v1/document/generate-pdf
// $-auth    Public
//  const generatePDF = async (req, res) => {
// 	const timestamp = Date.now();
//   const dynamicFilename = `document_${timestamp}.pdf`;
// 	pdf.create(pdfTemplate(req.body), options).toFile(
// 		dynamicFilename,
// 		(err) => {
// 			if (err) {
// 				res.send(Promise.reject());
// 			}
// 			res.send(Promise.resolve());
// 		}
// 	);
// };

 const generatePDF = async (req, res) => {
	const timestamp = Date.now();
	const dynamicFilename = `document_${timestamp}.pdf`;
	const filepath = path.join(dirname,`/uploads/${dynamicFilename}`);

	pdf.create(pdfTemplate(req.body), options).toFile(
	  filepath,
	  async (err) => {
		if (err) {
		  res.send(Promise.reject(err));
		} else {
		  // Assuming that the PDFs are saved in a specific directory
		  const pdfUrl =`/uploads/${dynamicFilename}`; // Adjust the path as needed
  
		  // Create a new Pdf document and save it to MongoDB
		  try {
			const newPdf = new Pdf({ url: pdfUrl });
			await newPdf.save();
			res.status(200).send({ url: pdfUrl });
		  } catch (error) {
			res.status(500).send(error);
		  }
		}
	  }
	);
  };
  

// $-title   Generate document
// $-path    GET /api/v1/document/get-pdf
// $-auth    Public
const getPDF = (req, res) => {
	res.sendFile(filepath);
};

// $-title   send document as email
// $-path    POST /api/v1/document/send-document
// $-auth    Public

const sendDocument = (req, res) => {
	const { profile, document } = req.body;

	pdf.create(pdfTemplate(req.body), options).toFile(filepath, (err) => {
		transporter.sendMail({
			from: process.env.SENDER_EMAIL,
			to: `${document.customer.email}`,
			replyTo: `${profile.email}`,
			subject: `Document from ${
				profile.businessName ? profile.businessName : profile.firstName
			}`,
			text: `Document from ${
				profile.businessName ? profile.businessName : profile.firstName
			}`,
			html: emailTemplate(req.body),
			attachments: [
				{
					filename: "myDocument.pdf",
					path: filepath,
				},
			],
		});

		if (err) {
			res.send(Promise.reject());
		}
		res.send(Promise.resolve());
	});
};


module.exports={generatePDF,getPDF,sendDocument}