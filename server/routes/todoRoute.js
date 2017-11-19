const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const middleware = require('../helpers/middleware');
const todoModel = require('../models/todoModel');
const ObjectId = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', middleware.isSignIn, todoController.get);
router.post('/add', middleware.isSignIn, todoController.create);
router.put('/edit/:todoId', middleware.isSignIn, todoController.update);
router.delete('/delete/:todoId', middleware.isSignIn, todoController.destroy);

module.exports = router;