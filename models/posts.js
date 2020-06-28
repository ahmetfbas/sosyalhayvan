var mongoose = require("mongoose"); 

var postSchema = new mongoose.Schema({
	title: String,
	subtitle: String,
	content: String,
	creationdate: {type: Date, default: Date.now},
	image: String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:  "User"
		},
		username: String,
		avatar: String,
		description: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});


module.exports = mongoose.model("Post", postSchema);