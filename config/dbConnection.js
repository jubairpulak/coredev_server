"use strict";

const dotenv = require("dotenv");
dotenv.config({ path: "../.config" });
"use strict"
const mongoose = require("mongoose");
const catchAsync = require("../error/catchAsync");


exports.dbConnection = async () => {
	// const dbURL = process.env.DB_URL.replace('dbname' , process.env.DB_NAME)

	const connectionOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	};

	// console.log(dbURL);
	try {
		await mongoose.connect(process.env.DB_URL, connectionOptions);
		console.log("connect vaiu...");
	} catch (err) {
		console.log("DB not connected", err);
	}
};
