var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	creationdate: {type: Date, default: Date.now()},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String,
		avatar: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);