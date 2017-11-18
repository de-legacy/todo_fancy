const url = 'mongodb://localhost:27017/todofancy';
const mongoose = require('mongoose').connect(url);
const Schema = mongoose.Schema;

const todoSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Account'
	},
	title: String,
	tasks: [
	],
	editor: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Account'
		}
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: null }
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;