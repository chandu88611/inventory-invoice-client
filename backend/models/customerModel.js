const mongoose = require("mongoose");
const validator=require("validator");

const { randomBytes } = require("crypto");

const { Schema } = mongoose;

const customerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
		},
		accountNo: String,
		vatTinNo: {
			type: Number,
			default: 0,
		},
		address: String,
		city: String,
		country: String,
		phoneNumber: {
			type: String,
			required: true,
			validate: [
				validator.isMobilePhone,
				"Your mobile phone number must begin with a '+', followed by your country code then actual number e.g +254123456789",
			],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

customerSchema.pre("save", async function (next) {
	this.accountNo = `CUS-${randomBytes(3).toString("hex").toUpperCase()}`;

	next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports= Customer;
