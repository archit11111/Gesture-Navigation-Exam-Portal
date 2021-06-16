const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
	creatorName: { type: String, required: true },
	creatorId: { type: String, required: true },
	examName: { type: String, required: true },
	examDescription: { type: String },
	examStartTime: { type: String },
	examEndTime: { type: String },
	timelimit: { type: Number },
	questions: { type: Object },
	totalMarks: { type: Number },
});

module.exports = Exam = mongoose.model("exam", examSchema);
