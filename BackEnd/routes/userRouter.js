const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Exam = require("../models/examModel");

router.post("/register", async (req, res) => {
	try {
		let { email, password, passwordCheck, displayName } = req.body;

		// validate

		if (!email || !password || !passwordCheck)
			return res.status(400).json({ msg: "Not all fields have been entered." });
		if (password.length < 5)
			return res.status(400).json({ msg: "The password needs to be at least 5 characters long." });
		if (password !== passwordCheck)
			return res.status(400).json({ msg: "Enter the same password twice for verification." });

		const existingUser = await User.findOne({ email: email });
		if (existingUser) return res.status(400).json({ msg: "An account with this email already exists." });
		if (!displayName) displayName = email;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			password: passwordHash,
			displayName,
		});
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/register/admin", async (req, res) => {
	try {
		let { email, password, passwordCheck, displayName, adminKey } = req.body;

		// validate

		if (!email || !password || !passwordCheck)
			return res.status(400).json({ msg: "Not all fields have been entered." });
		if (password.length < 5)
			return res.status(400).json({ msg: "The password needs to be at least 5 characters long." });
		if (password !== passwordCheck)
			return res.status(400).json({ msg: "Enter the same password twice for verification." });
		if (adminKey !== "secret#0001") return res.status(400).json({ msg: "Unable to create Admin Account." });

		const existingUser = await Admin.findOne({ email: email });
		if (existingUser) return res.status(400).json({ msg: "An account with this email already exists." });
		if (!displayName) displayName = email;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new Admin({
			email,
			password: passwordHash,
			displayName,
		});
		const savedUser = await newUser.save();
		res.json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/login", async (req, res) => {
	console.log("s");
	try {
		const { email, password } = req.body;

		// validate
		if (!email || !password) return res.status(400).json({ msg: "Not all fields have been entered." });

		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: "No account with this email has been registered." });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
		res.json({
			token,
			user: {
				id: user._id,
				displayName: user.displayName,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/login/admin", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ msg: "Not all fields have been entered." });

		const admin = await Admin.findOne({ email: email });
		if (!admin) return res.status(400).json({ msg: "No account with this email has been registered." });

		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

		const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY);
		res.json({
			token,
			user: {
				id: admin._id,
				displayName: admin.displayName,
				admin: true,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
});

router.delete("/delete", auth, async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.user);
		res.json(deletedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/tokenIsValid", async (req, res) => {
	try {
		const token = req.header("x-auth-token");
		if (!token) return res.json(false);

		const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (!verified) return res.json(false);

		const user = await User.findById(verified.id);
		const admin = await Admin.findById(verified.id);
		if (!user && !admin) return res.json(false);

		return res.json(true);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/", auth, async (req, res) => {
	const user = await User.findById(req.user);
	if (user) {
		res.json({
			displayName: user.displayName,
			email: user.email,
			id: user._id,
		});
	}

	const admin = await Admin.findById(req.user);
	res.json({
		displayName: admin.displayName,
		id: admin._id,
		admin: true,
	});
});

const getFormattedCurrentDate = () => {
	return `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.${new Date().getMilliseconds()}+05:30`;
};

router.post("/logTabSwitchedAway", auth, async (req, res) => {
	const newTabSwitchLog = { switchedAway: getFormattedCurrentDate(), switchedBack: null };
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.user },
			{ $push: { tabSwitchLogs: newTabSwitchLog } },
			{ $upsert: true, new: true }
		);
		console.log("-->", updatedUser);
	} catch (e) {
		res.status(500).json({ error: "unable to log" });
		return;
	}
	// const user = await User.findById(req.user);

	// if (!user.tabSwitchLogs) user.tabSwitchLogs = [newTabSwitchLog];
	// else {
	// 	console.log(user);
	// 	console.log("push");
	// 	user.tabSwitchLogs.push(newTabSwitchLog);
	// 	console.log(user);
	// }

	// const saved = await user.save();
	// console.log("saway", saved);

	return res.json(true);
});

router.post("/logTabSwitchedBack", auth, async (req, res) => {
	const switchedBackTime = getFormattedCurrentDate();
	const user = await User.findById(req.user);
	// console.log("***", user.tabSwitchLogs.length);
	user.tabSwitchLogs[user.tabSwitchLogs.length - 1].switchedBack = switchedBackTime;
	// user.markModified("tabSwitchLogs");
	const saved = await user.save();
	console.log("sback", saved);

	return res.json({ success: true });
});

router.post("/createTest", auth, async (req, res) => {
	const { creator, examName, examDescription, examStartDateTime, examEndDateTime, timeLimit, questions } = req.body;
	// const timelimit = new Date(examEndDateTime).getTime() - new Date(examStartDateTime).getTime();
	const totalMarks = questions.reduce((acc, question) => acc + Number(question["marks"]), 0);
	const newTest = new Exam({
		creatorName: creator.displayName,
		creatorId: creator.id,
		examName,
		examDescription,
		examStartTime: examStartDateTime,
		examEndTime: examEndDateTime,
		timelimit: timeLimit,
		questions,
		totalMarks,
	});

	newTest
		.save()
		.then((response) => console.log(response))
		.catch((err) => console.log(err));
	res.json({ success: true });
});

router.get("/fetchAllExams", auth, async (req, res) => {
	const exams = await Exam.find({});
	console.log(exams);
	res.json(exams);
});

router.post("/fetchExam", auth, async (req, res) => {
	const data = req.body;
	console.log("fetch exam", data);
	try {
		const exam = await Exam.findById(data.examId);
		console.log("exam", exam);
		res.json(exam);
	} catch (e) {
		res.status(404).json({ error: "no such exam!" });
	}
});

router.post("/createMessage", auth, async (req, res) => {
	const { creator, title, message, notificationStartTime, notificationEndTime } = req.body;

	const msg = { title, message, startTime: notificationStartTime, endTime: notificationEndTime };
	try {
		const updatedAdmin = await Admin.findOneAndUpdate(
			{ _id: req.user },
			{ $push: { messages: msg } },
			{ $upsert: true, new: true }
		);
	} catch (e) {
		res.status(500).json({ error: "unable to create message" });
		return;
	}

	return res.json(true);
});

module.exports = router;
