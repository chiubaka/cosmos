exports.cosmos = function(req, res) {
	res.render('cosmos', { user: req.user });
};
