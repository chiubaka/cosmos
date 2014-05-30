exports.login = function(req, res) {
	res.render('login', { user: req.user });
};