var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');
const middleware = require('../helpers/middleware');

/* GET home page. */
router.get('/', middleware.isSignIn, function(req, res) {
	accountController.findByFacebookId("10210058400722985")
		.then(account => {
			res.send(account);
		}).catch(err => res.send(err.message));

  // res.render('index', { title: 'Express' });
});

router.post('/api/signup', accountController.create)
router.post('/api/signin', middleware.signIn, accountController.signIn)

module.exports = router;
