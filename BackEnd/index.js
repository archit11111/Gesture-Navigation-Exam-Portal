const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const PORT = 10000; //process.env.PORT || 6000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

mongoose.connect(
	/*process.env.MONGODB_CONNECTION_STRING*/
	"mongodb://localhost:27017/Exams",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) throw err;
		console.log("MongoDB connection established");
	}
);

app.use("/users", require("./routes/userRouter"));
