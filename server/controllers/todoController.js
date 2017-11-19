const todoModel = require('../models/todoModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;

const create = (req, res) => {
	let todo = new todoModel({
		title: req.body.title,
		category: req.body.category,
		owner: req.verifiedUser._id,
		isComplete: req.body.isComplete === 'false' ? false : true,
		createdAt: new Date(),
		editorlist: req.body.editorlist,
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
	if (typeof req.body.title !== 'undefined') {
		todo.title = req.body.title;
	}

	if (typeof req.body.category !== 'undefined') {
		todo.category = req.body.category;
	}

	if (typeof req.body.owner !== 'undefined') {
		todo.owner = req.body.owner;
	}

	if (typeof req.body.isComplete !== 'undefined') {
		todo.isComplete = req.body.isComplete;
	}

	if (typeof req.body.editors !== 'undefined') {
		todo.editors = req.body.editors;
	}

	todo.updatedAt = new Date();

	todoModel.findOneAndUpdate(
		{
			_id : ObjectId(req.params.todoId),
			owner: ObjectId(req.verifiedUser._id)
		},
		todo,
		{
			upsert: true,
			new: true,
			returnNewDocument: true
		},
		(err, todo) => {
			if (err) {
				res.status(500).send({message: "Can not Update Todo", error: err.message});
			} else {
				if (todo !== null) {
					res.status(200).send({message: "Success updating Todo", data: todo});
				} else {
					res.status(401).send({message: "Unauthorized update action", data: todo});
				}
			}
		}
	)
}

const destroy = (req, res) => {
	todoModel.findOneAndRemove({
		_id : ObjectId(req.params.todoId),
		owner: ObjectId(req.verifiedUser._id)
	}, (err, todo) => {
			if (err) {
				res.status(500).send({message: err.message});
			} else {
				if (todo !== null) {
					res.status(200).send({message: "Todo deleted", data: todo});
				} else {
					res.status(401).send({message: "Unauthorized delete action", data: todo});
				}
			}
		})
}

const get = (req, res) => {
	todoModel.find({owner: ObjectId(req.verifiedUser._id)})
		.then(todos => {
				res.status(200).send(todos);
			}).catch(err => res.status(401).send({message: err.message}));
}

module.exports = {
	create,
	get,
	update,
	destroy,
}