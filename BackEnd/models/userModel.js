const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 5 },
	displayName: { type: String },
	tabSwitchLogs: [
		{
			switchedAway: { type: String },
			switchedBack: { type: String },
		},
	],
});

module.exports = User = mongoose.model("user", userSchema);
