const accountController = require('../controllers/accountController');
const accountModel = require('../models/accountModel');
const Helper =  require('../helpers/helper');
const jwt = require('jsonwebtoken');
const FB = require('fb');
FB.options({ version: 'v2.11' });

const signIn = (req, res, next) => {
	if (typeof req.body.username !== "undefined") {
		accountController.findByUsername(req.body.username)
		.then(account => {
			if (account) {
				// Login dengan Account biasa
				Helper.comparePassword(req.body.password, account.password)
					.then(verifiedAccount => {
						if (verifiedAccount) {
							Helper.signWebToken({
								_id: account._id,
								username: account.username,
								password: account.password,
								// full_name: account.full_name,
								// email: account.email,
								// facebook_id: account.facebook_id
							})
								.then(token => {
									req.header.todo_token = token;
  								req.header.email = account.email;
  								req.header.full_name = account.full_name;
  								req.header._id = account._id;

									next();

								}).catch(err => res.status(401).send({message: "Unauthorized User", error: err.message}));
						} else {
							res.status(401).send({message: "Unauthorized User", error: err.message})
						}

					}).catch(err => res.status(401).send({message: "Unauthorized User", error: err.message}));
			}

		}).catch(err => res.send(err.message));
	} else {
		res.status(401).send({message: "Unauthorized User", error: err.message})
	}
}

const signinFacebook = (req, res, next) => {
	if (req.headers.facebook_token) {
		FB.setAccessToken(req.headers.facebook_token);
		next();
	} else {
		res.status(401).send({message: 'Unauthorized Login Access'});
	}
}

const isSignIn = (req, res, next) => {
	jwt.verify(req.headers.token_todo, process.env.JWT_SECRET, (err, decoded) => {
		if (typeof decoded !== 'undefined') {
			req.verifiedUser = decoded
			next();

		} else {
			res.status(401).send({message: 'Unauthorized Login Access'});
		}
	});
}

const isAdmin = (req, res, next) => {
	if (req.header('admin_secret') === process.env.ADMIN_SECRET) {
		next();
	} else {
		res.status(500).send({message: 'Unauthorized Accesss'});
	}
}

module.exports = {
	signIn,
	isSignIn,
	signinFacebook,
	isAdmin
}