const accountController = require('../controllers/accountController');
const accountModel = require('../models/accountModel');
const Helper =  require('../helpers/helper');
const jwt = require('jsonwebtoken');

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
								full_name: account.full_name,
								email: account.email,
								facebook_id: account.facebook_id
							})
								.then(token => {
									req.header.token = token;
  								req.header.email = account.email;
  								req.header.full_name = account.full_name
									next();

								}).catch(err => res.status(401).send({message: "Unauthorized1 User", error: err.message}));
						} else {
							res.status(401).send({message: "Unauthorized User", error: err.message})
						}

					}).catch(err => res.status(401).send({message: "Unauthorized User", error: err.message}));
			}

		}).catch(err => res.send(err.message));
	} else {
		// Cek dengan Facebook
		accountController.findByFacebookId(req.body.facebook_id)
			.then(account => {
				if (account) {
					// Sign
					Helper.signWebToken(
						{
							email: account.email,
							full_name: account.full_name,
							facebook_id: account.facebook_id
						}
					).then(token => {
							req.header.token = token;
							req.header.email = account.email;
							req.header.full_name = account.full_name
							next();

						}).catch(err => res.status(500).send({error: err.message}));

				} else {
					accountController.modifyAccount(
						{
							email: req.body,email,
							full_name: req.body.full_name,
							facebook_id: req.body.facebook_id
						}
					).then(createdAccount => {
						Helper.signWebToken(createdAccount)
							.then(token => {
								req.header.token = token;
								req.header.email = createdAccount.email;
								req.header.full_name = createdAccount.full_name
								next();

							}).catch(err => res.status(500).send({error: err.message}));

					}).catch(err => res.status(500).send({message: "Error Sign In", error: err.message}));
				}

			}).catch(err => res.status(401).send({error: err.message}));
	}
}

const isSignIn = (req, res, next) => {
	jwt.verify(req.header('token_todo'), process.env.JWT_SECRET, (err, decoded) => {
		console.log(decoded)
		if (typeof decoded !== 'undefined') {
			req.verifiedUser = decoded
			next();

		} else {
			res.status(401).send({message: 'Unauthorized Login Access'});
		}
	});
}

const isAdmin = (req, res, next) => {
	if (req.header('admin_email') === process.env.ADMIN_EMAIL) {
		next();
	} else {
		res.status(500).send({message: 'Unauthorized Accesss'});
	}
}

module.exports = {
	signIn,
	isSignIn,
	isAdmin
}