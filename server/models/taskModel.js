const url = 'mongodb://localhost:27017/todofancy';
const mongoose = require('mongoose').connect(url);
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	todoId: {
		type: Schema.Types.ObjectId,
		ref: 'Todo'
	},
	title: String,
	isComplete:  Boolean
});

const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;