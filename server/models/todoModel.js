const url = 'mongodb://localhost:27017/todofancy';
const mongoose = require('mongoose').connect(url);
const Schema = mongoose.Schema;

const todoSchema = new Schema({
	heading: String,
	tasks: [
		{
			title: { type: String, default: '' },
			isComplete: { type: Boolean, default: false }
		}
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
	},
	editor: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Account',
			default: null
		}
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: null }
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;