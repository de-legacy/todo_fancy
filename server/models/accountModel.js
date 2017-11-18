const url = 'mongodb://localhost:27017/todofancy';
const mongoose = require('mongoose').connect(url);
const Schema = mongoose.Schema;

const accountSchema = new Schema({
	username: String,
	password:  String,
	full_name:   String,
	email: String,
	facebook_id: { type: String, default: null },
	createdAt: { type: Date, default: Date.now }
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;