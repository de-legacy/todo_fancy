const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Helper {
	static getHashedPassword(plainPassword) {
		return new Promise((resolve, reject) => {
			const saltRounds = 10;

			bcrypt.hash(plainPassword, saltRounds).then(function(hash) {
				resolve(hash)
			}).catch(err => reject(err));
		});
	}

	static comparePassword(inputPassword, storedPassword) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(inputPassword, storedPassword).then(function(result) {
				if (result) {
					resolve(result)
				} else {
					reject(result);
				}
			}).catch(err => reject(err));
		});
	}

	static signWebToken(data) {
		return new Promise((resolve, reject) => {
			jwt.sign(
				data, process.env.JWT_SECRET,
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token)
					}
				}
			);
		});
	}
}

module.exports = Helper;