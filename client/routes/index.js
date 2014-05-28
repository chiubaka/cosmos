
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Cosmos Authentication Prototype', user: req.user });
};

exports.account = function(req, res){
	res.render('account', { title: 'Account Specs', user: req.user });
};

exports.login = function(req, res) {
	res.render('login', { title: 'Please sign in', user: req.user });
};

exports.cosmos = function(req, res) {
	res.render('cosmos', { title: 'Cosmos', user: req.user});
}