const accountModel = require('../models/accountModel');
const Helper = require('../helpers/helper');
const ObjectId = require('mongodb').ObjectID;

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
			account.save((err, createdAcount) => {
				if (err) {
					res.status(500).send({message: err.message});
				} else {
					res.status(200).send({message: "Account added", account: createdAcount});
				}
			})

		}).catch(err => res.status(500).send({message: err.message}));
	} else {
		account.password = (req.body.password === null) ? null : account.password;

		account.save((err, createdAcount) => {
			if (err) {
				res.status(500).send({message: err.message});
			} else {
				res.status(200).send({message: "Account added", account: createdAcount});
			}
		})
	}
}

const signIn = (req, res) => {
	res.send({token: req.header.token, email: req.header.email, full_name: req.header.full_name})
}

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

const modifyAccount = (account) => {
	return new Promise((resolve, reject) => {
		account.username = account.username || null;
		account.full_name =  account.full_name || null;
		account.email = account.email || "";
		account.facebook_id = account.facebook_id || null;

		if (typeof account.password !== "undefined" && account.password !== null) {
			Helper.getHashedPassword(req.body.password)
			.then(password => {
				account.password =  password ;
				account.save((err, createdAcount) => {
					if (err) {
						reject(err);
					} else {
						resolve(createdAcount);
					}
				})

			}).catch(err => res.status(500).send({message: err.message}));
		} else {
			account.password = (account.password === null) ? null : account.password;

			account.save((err, createdAcount) => {
				if (err) {
					reject(err);
				} else {
					resolve(createdAcount);
				}
			})
		}
	});
}

module.exports = {
	findAll,
	create,
	update,
	destroy,
	signIn,
	findByUsername,
	findByFacebookId,
	modifyAccount
}