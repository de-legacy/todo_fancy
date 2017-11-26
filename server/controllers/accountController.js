const accountModel = require('../models/accountModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;
const FB = require('fb');
FB.options({ version: 'v2.11' });

const findByUsername = (username) => {
	return new Promise((resolve, reject) => {
		accountModel.findOne({ username: username })
		.then(user => {
			resolve(user);
		}).catch(err => reject(err.message));
	});
}

const findByFacebookId = (facebook_id) => {
	return new Promise((resolve, reject) => {
		accountModel.findOne({ facebook_id: facebook_id })
		.then(user => {
			resolve(user);
		}).catch(err => reject(err));
	});
}


const create = (req, res) => {
	// Check if email exist, jika ya update data

	accountModel.findOne({
		email: req.body.email
	}).then(account => {
		if (account) {
			// Update
			upsertAccount(account, req, res);

		} else {
			// Create new account
			let newAccount = new accountModel({
				username: req.body.username || null,
				password: req.body.password || null,
				full_name: req.body.full_name || null,
				email: req.body.email || null,
				facebook_id:  req.body.facebook_id || null
			})

			upsertAccount(newAccount, req, res);
		}

	}).catch(err => res.status(500).send({message: err.message}));
}

const update = (req, res) => {
	accountModel.findOne({
		_id: ObjectId(req.params.accountId)
	}).then(account => {
		if (account) {
			// Update
			upsertAccount(account, req, res);
		}

	}).catch(err => res.status(500).send({message: err.message}));
}

const findAll = (req, res) => {
	accountModel.find({})
	.then(accounts => {
		res.status(200).send(accounts)

	}).catch(err => res.status(500).send({message: err.message}));
}

const findAllLimited = (req, res) => {
	let accountProjection = {
		password: false,
		facebook_id: false,
		createdAt: false,
		__v : false,
	}

	accountModel.find({}, accountProjection)
	.then(accounts => {
		res.status(200).send(accounts)

	}).catch(err => res.status(500).send({message: err.message}));
}

const destroy = (req, res) => {
	accountModel.findByIdAndRemove(ObjectId(req.params.accountId), (err, accountDeleted) => {
		if (err) {
			res.status(500).send({message: err.message});
		} else {
			res.status(200).send({
				message: 'Account deleted',
				account: accountDeleted
			});
		}

	})
}

const upsertAccount = (account, req, res) => {
	account.username = req.body.username || account.username;
	account.full_name =  req.body.full_name || account.full_name;
	account.email = req.body.email || account.email;
	account.facebook_id = req.body.facebook_id || account.facebook_id;

	if (typeof req.body.password !== "undefined" && req.body.password !== null) {
		Helper.getHashedPassword(req.body.password)
		.then(password => {
			account.password =  password ;
			account.save((err, createdAccount) => {
				if (err) {
					res.status(500).send({message: err.message});
				} else {
					res.status(200).send({message: "Account added", account: createdAccount});
				}
			})

		}).catch(err => res.status(500).send({message: err.message}));
	} else {
		account.password = (req.body.password === null) ? null : account.password;

		account.save((err, createdAccount) => {
			if (err) {
				res.status(500).send({message: err.message});
			} else {
				res.status(200).send({message: "Account added", account: createdAccount});
			}
		})
	}
}

const signIn = (req, res) => {
	res.send({token: req.header.todo_token, email: req.header.email, full_name: req.header.full_name})
}

const signupFacebook = (req, res) => {
	FB.api('/me', {fields: ['id', 'name', 'email', 'cover']}, (data) => {
		if (data) {

			findByFacebookId(data.id)
				.then(account => {
					if (account !== null && typeof account !== 'undefined') {
						// Sign
						Helper.signWebToken(
						{
							id: account.id,
							email: account.email,
							// full_name: account.full_name,
							facebook_id: account.facebook_id
						}
						).then(token => {

							res.status(200).send({
								message: "Success Sign In",
								token: token,
								email: account.email,
								full_name: account.full_name
							})

						}).catch(err => res.status(500).send({error: err.message}));

					} else {
						let accountParam = {
							email: data.email,
							full_name: data.name,
							facebook_id: data.id
						};

						let newAccount = new accountModel(accountParam);

						newAccount.save((err, createdAccount) => {
							if (err) {
								res.status(401).send({message: 'Unauthorized SignUp', error: err.message});
							} else {
								Helper.signWebToken({
									email: createdAccount.email,
									full_name: createdAccount.full_name,
									facebook_id: createdAccount.facebook_id
								}).then(token => {
									res.status(200).send({
										message: "Success Sign Up",
										token: token,
										email: createdAccount.email,
										full_name: createdAccount.full_name
									})

								}).catch(err => res.status(500).send({error: err.message}));
							}

						})
					}

				}).catch(err => res.status(401).send({error: err.message}));

		} else {
			res.status(401).send({message: 'Unauthorized Login', error: err.message});
		}
	})
}


module.exports = {
	findAll,
	create,
	update,
	destroy,
	signIn,
	findAllLimited,
	findByUsername,
	findByFacebookId,
	signupFacebook
}