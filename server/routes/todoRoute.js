const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const middleware = require('../helpers/middleware');

/* GET users listing. */
// router.get('/', middleware.isAdmin, accountController.findAll);
router.post('/create', todoController.create);
router.put('/update/:todoId', todoController.update);
// router.delete('/delete/:accountId', middleware.isAdmin, accountController.destroy);

module.exports = router;