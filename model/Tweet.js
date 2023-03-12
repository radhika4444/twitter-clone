const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweetSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique:true
	},
	text: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	isadmin:false
})


module.exports = mongoose.model('Tweet', tweetSchema)