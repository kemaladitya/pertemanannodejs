//include bcrypt ke userdatajs biar bisa dipake
const bcrypt = require('bcryptjs');
//include mongoose ke userdata.js biar bisa dipake
const mongoose = require('mongoose');


//buat skema untuk di mongodb
const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, trim: true, index: { unique: true } },
	password: { type: String, required: true },
	profile_name: {type: String, required: true, trim: true}
});


//autentikasi untuk login
//kalau error, return Usernya ga ada
//kalau berhasil biarin aja
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, userdata) {
		    if (error) {
		     	return callback(error);

		    } else if ( !userdata ) {
		      	var err = new Error('User tidak ada.');
		      	err.status = 401;
		      	return callback(err);
		    }

		    bcrypt.compare(password, userdata.password , function(error, result) {
		    	if (result === true) {
		        	return callback(null, userdata);
		    	} else {
		        	return callback();
		      	}
		    })
      });
}


//enkripsi dulu sebelu mau di create, terus lempar lagi ke fungsi hasil enkripsi passwordnya
UserSchema.pre('save', function(next) {
	var user = this;
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		})
	});
});


const User = mongoose.model('userdata', UserSchema);
module.exports = User;