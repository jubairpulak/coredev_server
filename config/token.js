module.exports = {
	token_Secret: process.env.JWT_SECRET,
	token_Expires: process.env.NODE_ENV.startsWith("d")
		? process.env.JWT_COOKIE_EXPIRES_IN
		: "2d",
};
