const todoModel = require('../models/todoModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;

const create = (req, res) => {
	console.log('~~~~~~~~~~~~ create');

	let todo = new todoModel({
		heading: req.body.heading,
		owner: req.body.owner,
		tasks: parseTodoResult(req.body.tasks),
		createdAt: new Date()
	});

	todo.save((err, todo) => {
		if (err) {
			res.status(500).send({message: err.message});
		} else {
			res.status(200).send({todo: todo, message: 'Todo Added'});
		}
  });
}

const update = (req, res) => {
	let todo = {};
	if (typeof req.body.heading !== 'undefined') {
		todo.heading = req.body.heading;
	}

	if (typeof req.body.owner !== 'undefined') {
		todo.owner = req.body.owner;
	}

	if (typeof req.body.tasks !== 'undefined') {
		todo.tasks = parseTodoResult(req.body.tasks);
	}

	if (typeof req.body.editors !== 'undefined') {
		todo.editors = req.body.editors;
	}

	todo.updatedAt = new Date();

	todoModel.findOneAndUpdate(
		{
			_id : ObjectId(req.params.todoId)
		},
		todo,
		{
			upsert: true,
			new: true,
			returnNewDocument: true
		},
		(err, todo) => {
			if (err) {
				res.status(500).send({message: err.message});
			} else {
				res.status(200).send({message: "Success updating Todo", data: todo});
			}
		}
	)
}

const parseTodoResult = (tasks) => {
	let arrTasks = [];
	let parsedTaskArray = [];

	if (Array.isArray(tasks) === false){
		arrTasks.push(tasks);
	} else {
		arrTasks = tasks;
	}


	Array.from(arrTasks).forEach(task => {
		let obj = JSON.parse(task);

		if (obj.isComplete === 'false') {
			obj.isComplete = false
		} else {
			obj.isComplete = true
		}

		parsedTaskArray.push(obj)
	})

	return parsedTaskArray;
}

module.exports = {
	create,
	update
}