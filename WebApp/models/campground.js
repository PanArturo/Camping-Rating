const mongoose = require('mongoose');

var cgSchema = new mongoose.Schema({ 										// Schema for our campground
	name: String, 
	image: String, 
	description: String, 
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});  	

module.exports = mongoose.model("campground", cgSchema);    				// create model in a seperate file and export it 
