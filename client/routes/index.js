const express = require('express');
const router = express.Router();
const store = require('store');
const fetch = require('node-fetch');

router.get('/signup', function(req, res, next) {
	if(req.session.email){
		return res.status(301).redirect('/profile');
	}
	res.status(200).render('signup');
});

router.get('/login', function(req, res, next) {
	if(req.session.email){
		return res.status(301).redirect('/profile');
	} else {
		return res.status(200).render('login');
	}
});


router.get('/find/:key', function (req, res, next){
	console.log()
	if(req.cookies.email_login){
		var json = { key: req.params.key, email_login: store.get('email').name };
		return res.cookie('key', JSON.stringify(json)).status(200).render('find');
	}
	return res.status(200).redirect('/login');
});

router.get('/profile', function(req, res, next) {
	return res.status(200).render('profile');
});

router.post('/profile', function(req, res, next){
	var data = req.body.email;
	res.cookie('session', data);
	store.set('email', { name: req.body.email });
	req.session.email = req.body.email;
	//return res.send(200);
	const dataLogin = { email_login: req.session.email };
	return res.cookie('email_login', JSON.stringify(dataLogin)).send(200);
});

router.get('/logout', function(req, res, next) {
	if(req.session){
		//req.session = null;
		req.session.destroy;
		store.clearAll();
		res.clearCookie('session');
		return res.status(200).redirect('/login');
	} else {
		return res.status(200).redirect('/login');
	}
});


//
router.get('*', function(req, res, next) {
	res.status(404).send('404');
});

//
router.post('*', function(req, res, next) {
	res.status(404).send('404');
});

module.exports = router;
