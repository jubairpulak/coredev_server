const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subscriptionModel = new mongoose.Schema(
	{
		packagename: {
			type: String,
			required: true,

			unique: true,
		},
		slug: String,

		description: {
			type: String,
			required: true,
			min: 6,
		},
		userlist: [
			{
				type: ObjectId,
				ref: "UserSchema",
			},
		],
	},
	{ timestamps: true }
);

subscriptionModel.index({ packagename: 1 });

module.exports = mongoose.model("SubscriptionModel", subscriptionModel);
