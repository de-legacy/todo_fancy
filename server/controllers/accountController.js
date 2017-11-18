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

		console.log('~~~~~~~~~~~~~~ ', req.body.password)

	if (typeof req.body.password !== "undefined") {
		Helper.getHashedPassword(req.body.password)
		.then(password => {
			console.log('HASHED PASS ```', password);

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
		account.password = account.password;
		account.save((err, createdAcount) => {
			if (err) {
				res.status(500).send({message: err.message});
			} else {
				res.status(200).send({message: "Account added", account: createdAcount});
			}
		})
	}
}

module.exports = {
	findAll,
	create,
	update,
	destroy
}