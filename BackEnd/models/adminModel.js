const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 5 },
	displayName: { type: String },
	messages: [
		{
			title: { type: String },
			message: { type: String },
			startTime: { type: String },
			endTime: { type: String },
		},
	],
});

module.exports = Admin = mongoose.model("admin", adminSchema);
