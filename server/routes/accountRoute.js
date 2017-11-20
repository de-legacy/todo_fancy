const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const middleware = require('../helpers/middleware');

/* GET users listing. */
router.get('/', middleware.isAdmin, accountController.findAll);
router.post('/create', middleware.isAdmin, accountController.create);
router.put('/update/:accountId', middleware.isSignIn, accountController.update);
router.delete('/delete/:accountId', middleware.isAdmin, accountController.destroy);

module.exports = router;
