const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	_id:mongoose.Schema.Types.ObjectId,
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required:true
	},
	newpassword:{
		type:String
	}
})

module.exports = mongoose.model('User', userSchema)