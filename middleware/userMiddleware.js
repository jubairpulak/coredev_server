"use strict"

const catchAsync = require("../error/catchAsync");
const config = require("../config")
const JWT = require("jsonwebtoken")
const {promisify} = require("util")
exports.userauthorization = catchAsync(async (req, res, next) =>{
	const { token_Secret } = config.token;


	// if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
	//    token =  req.headers.authorization.split(' ')[1]
	// }
	const token = req.headers.authtoken;
	console.log("hey token", req.headers);
	console.log("hey token", req.headers.authtoken);

	const decodeToken = await promisify(JWT.verify)(token, token_Secret);

	req.user = decodeToken;
	console.log(req.user);
	next();
})