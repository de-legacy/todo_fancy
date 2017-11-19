const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const middleware = require('../helpers/middleware');
const todoModel = require('../models/todoModel');
const ObjectId = require('mongodb').ObjectID;

/* GET users listing. */
// router.get('/', middleware.isAdmin, accountController.findAll);
router.post('/create', todoController.create);
router.put('/update/todo/:todoId', todoController.update);
router.post('/update/todo/:todoId/tasklist/:taskId', (req, res) => {
	todoModel.findOne(
		{
			'_id': ObjectId(req.params.todoId),
		},
		function(err, todo) {

			if (todo) {
				todo.tasklist.forEach( function(task, index) {
					if (req.params.taskId == task._id) {
						task.isComplete = req.body.isComplete === 'false' ? false : true;
					}
				});

				todo.save((err, todoUpdated) => {
					if (err) {
						res.status(500).send({error: err.message})
					} else {
						res.status(200).send({message: 'Task Updated', data: todoUpdated})
					}
				})
			}
		}
	)

});
// router.delete('/delete/:accountId', middleware.isAdmin, accountController.destroy);

module.exports = router;