const isAdmin = (req, res, next) => {
	if (req.header('admin_email') === process.env.ADMIN_EMAIL) {
		next();
	} else {
		res.status(500).send({message: 'Unauthorized Accesss'});
	}
}

module.exports = {
	isAdmin
}