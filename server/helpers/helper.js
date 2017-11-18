const bcrypt = require('bcrypt');

class Helper {
	static getHashedPassword(plainPassword) {
		return new Promise((resolve, reject) => {
			const saltRounds = 10;

			bcrypt.hash(plainPassword, saltRounds).then(function(hash) {
				resolve(hash)
			}).catch(err => reject(err));
		});
	}
}

module.exports = Helper;