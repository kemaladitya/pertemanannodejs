//include express ke index.js biar bisa dipake
const express = require('express');
//include fungsi router dari express biar bisa dipake di index.js
const router = express.Router();
//include mongoose ke index.js biar bisa dipake 
const mongoose = require('mongoose');
//include modul dari userdata biar bisa dipake di index.js
const User = require('../models/userdata.js');
const Connection = require('../models/userconnection.js')

//menghubungkan proyek ke mongodb
mongoose.connect('mongodb://localhost:27017/pertemanan');

//tahan koneksi ke mongodb ke variabel
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));


/*
router.get('/test/:id', function(req, res, next) {
	return res.status(200).send(req.params.id);
});


router.post('/test', function(req, res, next) {
	if(!req.body.username){
		return res.status(404).send(false);
	}
	var data = req.params.username;
	return res.status(200).send(req.body.username + ' ' + req.body.password);
})
*/


//cari teman
router.post('/search/:name', function(req, res, next) {
	var data = req.params.name;
	User.find( { profile_name: new RegExp(req.params.name, "i") } ).exec(function(error, userdata){
		if(userdata.length == 0){
			return res.send(userdata);
		} else {
			var i = 0;
			var result = [];

			while (i < userdata.length){
				result.push({ id: userdata[i].email, profile_name: userdata[i].profile_name});
				i++;
			}

			return res.send(result);
		}

		
	})
})

//list teman pas login
router.post('/friendList', function(req, res, next){
	Connection.find( { email: req.body.email_login } ).exec(function(error, userdata){
		return res.send(userdata[0].connect);
	})
});


//tambah teman
router.post('/add', function(req, res, next){
	User.findOne({ email: req.body.email }).exec(function(error, userdata) {
		if(error){
			var err = {};
			err.status = 400;
			err.respon = 1;
		    err.error = error;
			return res.send(err);
		} else if(!userdata){
			var err = {};
			err.status = 400;
			err.data = "Username tidak ada";
			err.respon = 1;
			err.error = error;
			return res.send(err);
		} else {
			var addConnect = { _id: userdata._id, email: userdata.email, profile_name: userdata.profile_name};
			Connection.findOne( { email: req.body.email_login} ).then(function(record){
				record.connect.push( addConnect );
				record.save();
			});
			User.findOne({ email: req.body.email_login }).exec(function(error, userdatamore){
					var addConnectMore = { _id: userdatamore._id, email: userdatamore.email, profile_name: userdatamore.profile_name};
					Connection.findOne( { email: req.body.email} ).then(function(recordmore){
					recordmore.connect.push( addConnectMore );
					recordmore.save();
				});

			});
			return res.send(200);				
		}
	});
});


//autentikasi pas login
router.post('/auth', function(req, res, next) {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, userdata) {
		      if (error || !userdata) {
			      var err = new Error('Email atau password salah');
			      err.status = 401;
			      err.respon = 1;
			      err.error = 'Email atau password salah';
			      return res.send(err);
		      } else {
		      	  var userdetail = { email_login : req.body.email, status: 200 };
			      return res.status(200).send(userdetail);
		      }
		});
	} else {
		  var err = new Error('Mohon lengkapi data-nya!');
		  err.status = 401;
		  err.respon = 2;
		  err.error = 'Mohon lengkapi data-nya!';
		  return res.send(err);
	}
});



//daftar akun
router.post('/register', (req,res, next) => {
	// memastikan user telah mengisikan semua datanya
	if (req.body.email &&
	    req.body.password &&
	    req.body.profile_name) {

			// konfimasi lagi kalau user udah ngisi form 'konfirmasi password'
			if (req.body.password !== req.body.konfirmasiPassword) {
				var err = new Error('Password tidak sama!');
				err.status = 400;
				err.error = 'Password tidak sama!';
				err.respon = 1;
				return res.send(err);
			}

			//bikin object di userData buat di kirim/create ke mongoose ke mongodb
			var userData = {
			email: req.body.email,
			password: req.body.password,
			profile_name : req.body.profile_name
			};

			//add userData ke mongodb
			User.create(userData, function (error, user) {
				if (error) {
				var err = {};
				err.error = 'Email sudah terdaftar!';
				err.status = 400;
				err.respon = 2;
				return res.send(err);
			} else {
				Connection.create( { email: req.body.email } );
				var userdetail = { email: req.body.email, profile_name: req.body.profile_name };
				return res.status(200).send(userdetail);
			}
			});

	} else {
      var err = new Error('Mohon lengkapi data-nya!');
      err.status = 400;
      err.error = 'Mohon lengkapi data-nya!';
      err.respon = 3;
      return res.send(err);
    }
});


//biar orang akses ke end point aneh aneh ke filter ke 404
router.get('*', function(req, res, next) {
	res.status(404).send('404');
});

//biar orang akses ke end point aneh aneh ke filter ke 404
router.post('*', function(req, res, next) {
	res.status(404).send('404');
});

//project index.js jadiin modul 'router' biar bisa di pake di app.js
module.exports = router;