const mongoose = require("mongoose");

const TrackingLogSchema = new mongoose.Schema({
	name: { type: String, required: true },
	created_at: { type: String, required: true },
	finished_at: { type: String },
	time_limit: { type: String, required: true },
	calibrated_values: { type: Object },
	exam_id: { type: String, required: true },
	attention_logs: { type: Object },
});

module.exports = TrackingLog = mongoose.model("tracking_log", TrackingLogSchema);
