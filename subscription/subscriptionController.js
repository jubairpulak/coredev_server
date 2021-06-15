const SubscriptionModel = require("./subscriptionModel");
const userModel = require("../users/userModel");
const catchAsync = require("../error/catchAsync");
const AppError = require("../error/appError");
const { slugify } = require("jslugify");

const ValidationCheck = require("../services/validationUsingClass");
const AuthService = require("../services/authService");
exports.createSubscription = catchAsync(async (req, res, next) => {
	console.log("body data", req.body);
	const IspackagenameValid = new ValidationCheck(
		req.body.packagename,
		"Package Name"
	)
		.IsEmpty()
		.print();
	if (IspackagenameValid)
		return SendErrorResponse(IspackagenameValid, 400, next);

	//lastNamecheck
	const IsDescriptionValid = new ValidationCheck(
		req.body.description,
		"description"
	)
		.IsEmpty()
		.print();
	if (IsDescriptionValid)
		return SendErrorResponse(IsDescriptionValid, 400, next);

	let obj = {};
	obj.packagename = req.body.packagename;
	req.body.slug = slugify(obj);

	const createpackage = await new AuthService(
		SubscriptionModel
	).createPackage(req.body);

	if (createpackage.error === true)
		return next(new AppError(createpackage.ErrorMessage));

	res.status(201).json({
		status: "success",
		message: createpackage,
	});
});

exports.getallPackages = catchAsync(async (req, res, next) => {
	const getUserList = await new AuthService(SubscriptionModel).getAllData({});
	const getTaskdata = await new AuthService(SubscriptionModel).getAllData({
		userlist: req.user.userid,
	});

	res.status(201).json({
		length: getTaskdata.length,

		data: {
			getUserList,
		},
	});
});

exports.subscribePackage = catchAsync(async (req, res, next) => {
	const Issubscribe = await new AuthService(SubscriptionModel).updateField(
		req.body.packageId,
		req.user.userid
	);
	if (Issubscribe.error === true)
		return next(new AppError(Issubscribe.ErrorMessage));

	res.status(201).json({
		status: "success",
		message: "Successfully Subscribed",
	});
});
exports.gettasklist = catchAsync(async (req, res, next) => {
	const getUserList = await new AuthService(SubscriptionModel).getAllData({
		userlist: req.user.userid,
	});

	res.status(201).json({
		length: getUserList.length,
		data: {
			getUserList,
		},
	});
});
