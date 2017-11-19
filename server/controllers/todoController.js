const todoModel = require('../models/todoModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;

const create = (req, res) => {
	console.log('~~~~~~~~~~~~ create');
	let arrTasks = [];
	if (Array.isArray(req.body.tasks) === false){
		arrTasks.push(req.body.tasks);
	} else {
		arrTasks = req.body.tasks;
	}

	var parsedTaskArray = [];
	Array.from(arrTasks).forEach(task => {
		let obj = JSON.parse(task);

		if (obj.isComplete === 'false') {
			obj.isComplete = false
		} else {
			obj.isComplete = true
		}

		parsedTaskArray.push(obj)
	})


	console.log(parsedTaskArray);

	let todo = new todoModel({
		heading: req.body.heading,
		owner: req.body.owner,
		tasks: parsedTaskArray,
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

module.exports = {
	create
}