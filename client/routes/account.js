exports.account = function(req, res){
  res.render('account', { title: 'Account', user: req.user });
};