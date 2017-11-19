const url = 'mongodb://localhost:27017/todofancy';
const mongoose = require('mongoose').connect(url);
const Schema = mongoose.Schema;

const todoSchema = new Schema({
	title: { type: String, default: "" },
	category: { type: String, default: "Uncategorized" },
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
	},
	isComplete: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: null },
	editorlist: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Account',
			default: null
		}
	],
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;