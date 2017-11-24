const todoModel = require('../models/todoModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;

const create = (req, res) => {
	let todo = new todoModel({
		title: req.body.title,
		category: req.body.category,
		owner: Helper.getVerifiedUserId(req.verifiedUser),
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
	todoModel.findOne(
		{
			_id : ObjectId(req.params.todoId),
			$or: [
				{ owner: ObjectId(Helper.getVerifiedUserId(req.verifiedUser)) },
				{
					editorlist: { $in: [
						ObjectId(Helper.getVerifiedUserId(req.verifiedUser))
					]}
				}
			]
		}
	).then(todo => {

		if (todo !== null && typeof todo !== "undefined") {
			todo.title = req.body.title || todo.title;
			todo.category = req.body.category || todo.category;
			todo.owner = req.body.owner || todo.owner;
			todo.isComplete = req.body.isComplete || todo.isComplete;
			todo.editorlist = req.body.editorlist || todo.editorlist;
			todo.updatedAt = new Date();

			todo.save()
				.then(savedTodo => {
					if (savedTodo !== null) {
						res.status(200).send({message: "Success updating Todo", data: savedTodo});
					} else {
						res.status(401).send({message: "Unauthorized update action", data: savedTodo});
					}
				}).catch(err => res.status(500).send({message: "Can not Update Todo", error: err.message}));
			} else {
				res.status(401).send({message: "Unauthorized update actions"})
			}

	}).catch(err => res.status(500).send({message: "Can not Update todo", error: err.message}));
}

const destroy = (req, res) => {
	todoModel.findOne(
		{
			_id : ObjectId(req.params.todoId),
			$or: [
				{ owner: ObjectId(Helper.getVerifiedUserId(req.verifiedUser)) },
				{
					editorlist: { $in: [
						ObjectId(Helper.getVerifiedUserId(req.verifiedUser))
					]}
				}
			]
		}
	).then(todo => {
		if (todo !== null && typeof todo !== "undefined") {
			todo.remove()
				.then((todo) => {
					res.status(200).send({data: todo, message: 'Todo Deleted'})

				}).catch(err => res.status(500).send({message: "Can not delete todo", error: err.message}));

		} else {
			res.status(401).send({message: "Unauthorized delete actions"})
		}
	}).catch(err => res.status(500).send({message: "Can not delete todo", error: err.message}));
}

const get = (req, res) => {
	todoModel.find({
		// owner: ObjectId(Helper.getVerifiedUserId(req.verifiedUser)),
		$or: [
			{ owner: ObjectId(Helper.getVerifiedUserId(req.verifiedUser)) },
			{
				editorlist: { $in: [
					ObjectId(Helper.getVerifiedUserId(req.verifiedUser))
				]}
			}
		]
	}).then(todos => {
				res.status(200).send(todos);
			}).catch(err => res.status(401).send({message: err.message}));
}

module.exports = {
	create,
	get,
	update,
	destroy,
}