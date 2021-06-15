const express = require('express')

const router = express.Router()
const {
	validationAndSignUp,
	validationAndLogin,
	getMyProfile,
	adminCheck,
	userrole,
	getallUsers,
	updateUserName,
	updateParentsInfo,
	updateContractInfo,
	updatePassword,
	updateActive,
	updateUserRequest,
	logoutUser,
	deleteUser
	
} = require("./userController");

const {userauthorization} = require("../middleware/userMiddleware")
const {
	createSubscription, getallPackages, subscribePackage ,gettasklist
} = require("../subscription/subscriptionController");
router.post("/signup", validationAndSignUp);
router.post("/login", validationAndLogin);
router.route("/get-me").get(userauthorization, getMyProfile)
router.route("/get-all").get(userauthorization, userrole("admin"), getallUsers )
router.route("/update-name").patch(userauthorization,  updateUserName)

router.post("/logout", userauthorization, logoutUser);

router.route("/admin/update-role").put(userauthorization, userrole("admin"), updateUserRequest)

//delete user
router.route("/admin/delete-user").put(userauthorization, userrole("admin"), deleteUser)

//admin 
router.post("/current-admin", userauthorization, adminCheck);
// update admin
router.put("/admin/update-me", userauthorization, updateUserName);

//user update me
router.put("/user/update-me", userauthorization, updateUserName);
//user get me
router.post('/user/get-me', userauthorization, getMyProfile);

//user update pass
router.put("/user/update-pass", userauthorization,  updatePassword)

router.post("/admin/get-me", userauthorization, getMyProfile);

router.post(
	"/admin/get-users",
	userauthorization,
	userrole("admin"),
	getallUsers
);

router.post(
	"/admin/create-package",
	userauthorization,
	userrole("admin"),
	createSubscription
);


//admin get Package
router.post(
	"/admin/get-package",
	userauthorization,

	getallPackages
);

//admin get Task list of users
router.post(
	"/admin/get-tasklist",
	userauthorization,

	gettasklist
);

//admin sub package
router.put(
	"/user/subscribe-package",
	userauthorization,

	subscribePackage
);



module.exports =router