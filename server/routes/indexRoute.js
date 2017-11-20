var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');
const middleware = require('../helpers/middleware');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/api/signup', accountController.create)
router.post('/api/signin', middleware.signIn, accountController.signIn)
router.post('/api/signin/facebook', middleware.signinFacebook, accountController.signupFacebook)

module.exports = router;
