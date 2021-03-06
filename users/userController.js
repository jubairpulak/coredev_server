"use strict"
const dot = require('dot-object');
const bcryptjs = require("bcryptjs")

const _ = require("lodash")
const catchAsync = require("../error/catchAsync");
const AppError = require("../error/appError");

const ValidationCheck = require("../services/validationUsingClass");
const AuthService = require("../services/authService");
const UserModel = require("../users/userModel")

const {createToken} = require("../util/tokenRelated")
const SendErrorResponse = (errorMessage, statusCode, next) => {
	next(new AppError(errorMessage, statusCode));
};

exports.validationAndSignUp = catchAsync(async (req, res, next) => {
	//checkfirstname username, email, dateofbirth, passwor
	console.log("user name", req.body.username)
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.username,
		"User Name"
	)
		.IsEmpty()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.email,
		"Email"
	)
		.IsEmpty()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);

//Date of birth
	const Isdateofbirthnotvalid = new ValidationCheck(
		req.body.dateofbirth,
		"Date of birth"
	)
		.IsEmpty()
		.print();
	if (Isdateofbirthnotvalid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkemail
	const IsEmailValid = new ValidationCheck(req.body.email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);


  const UserSignUp =await new AuthService(UserModel).SignUp(req.body)
  

  if(UserSignUp.error === true){
         return next(new AppError(UserSignUp.ErrorMessage, UserSignUp.code))

  }
  else{
	  console.log("UserSignUp.data._id :" , UserSignUp.data.userid)
    res.status(201).json({
      status: "success",
      message : "Account has been created",
     
      
    })
  }  
});

exports.validationAndLogin =catchAsync(async(req, res, next)=>{
	console.log("req.body.emai", req.body.email)
	const IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print()
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	const UserLogin = await new AuthService(UserModel).Login(req.body)
	if(UserLogin.error === true) return next(new AppError(UserLogin.notfoundmessage, UserLogin.code))
	
	else{
		res.status(201).json({
		  status: "success",
		  message : "Login Successfully",

		  token : createToken(UserLogin.data._id, req, res),
		 user :{
			 UserLogin
		 } 
		})
	  }  

}
)

exports.getMyProfile = catchAsync(async(req, res, next)=>{

	const getProfile = await new AuthService(UserModel).findMe(req.user.userid)

	console.log(getProfile)
	res.status(201).json({
		getProfile
	})
})


exports.userrole = (...restrictedTo) => catchAsync(async(req, res ,next)=>{
	console.log( "data user",restrictedTo)
	const getUserRole = await new AuthService(UserModel).findUserWithRole(req.user.userid, restrictedTo, "last_Name" )
 
	getUserRole ? next() : res.status(403).send("You are not allowed")
	
})


exports.getallUsers = catchAsync(async(req, res, next)=>{
	const getUserList = await new AuthService(UserModel).getAllData({role : "user"});
	const getAdminList =  await new AuthService(UserModel).getAllData({role : "admin"});

	res.status(201).json({
		length : getUserList.length,
		data:{
			getUserList,
			getAdminList
		}
	})
})

exports.updateUserName = catchAsync(async(req, res, next) => {

	
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.username,
		"User Name"
	)
		.IsEmpty()
		.IsString()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	
		const finaldata = _.pick(req.body, ["username"])

	const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid,req.body,finaldata)
		
		
	  

	console.log(req.body)
	res.status(201).json({
		status : "success",
		message : "Data Update Successfully",
		data :{
			UpdateallThese
		}
	})
})




exports.updatePassword = catchAsync(async (req, res, next)=>{
		

	const IsCurrentPassworNotValid = new ValidationCheck(
		req.body.currentPassword,
		"Current Password"
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsCurrentPassworNotValid)
		return SendErrorResponse(IsCurrentPassworNotValid, 400, next);
    
		const checkcurrentPassword = await new AuthService(UserModel).checkCurrentPassword(req.user.userid, req.body.currentPassword)
        console.log("wrong info :", checkcurrentPassword)
		if(checkcurrentPassword.error === true) return next(new AppError(checkcurrentPassword.notfoundmessage, checkcurrentPassword.code))

		//checkpassword
		const IsPasswordNotValid = new ValidationCheck(
			req.body.password,
			"Password"
		)
			.IsEmpty()
			.IsLowerThanMin(6)
			.print();
		if (IsPasswordNotValid)
			return SendErrorResponse(IsPasswordNotValid, 400, next);
	
		//checkconfirmPassword and validity
		const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
			req.body.confirmPassword,
			"Confirm Password"
		)
			.IsEmpty()
			.IsPasswordMatched(req.body.password)
			.print();
		if (IsConfirmPasswordNotValidandNotMatched)
			return SendErrorResponse(
				IsConfirmPasswordNotValidandNotMatched,
				400,
				next
			);

			req.body.password = await bcryptjs.hash(req.body.password, 12)
	
		const finaldata = _.pick(req.body, ["password"])
		const UpdateallThese =await new AuthService(UserModel).updateInfo( req.user.userid, finaldata)


		res.status(201).json({
			status : "success",
			message : "Password updated Successfully",
			data :{
				UpdateallThese
			}
		})
	

})


exports.updateUserRequest = catchAsync(async(req, res, next)=>{

	
	const UpdateAccont = await new AuthService(UserModel).updateRequest(req.body.userid)

	res.status(201).json({
		status : "success",
		message : UpdateAccont
		
	})
})

exports.deleteUser = catchAsync(async(req, res, next)=>{


	console.log("user is deleted on ", req.body.userid)
	const DeleteAccount = await new AuthService(UserModel).deleteUser(req.body.userid)

	res.status(201).json({
		status : "success",
		message : DeleteAccount
		
	})
})



exports.logoutUser = catchAsync(async (req, res, next)=>{
	res.cookie('jwt',  "loggedout",{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
       
    })

    res.status(201).json({status : "success", message : "You have logged out"})
})

exports.adminCheck = catchAsync(async(req,res,next)=>{
	const {email}  = req.user;
})