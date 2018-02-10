const mongoose = require('mongoose');
const schema = mongoose.Schema;


const addFriend = new schema({
	_id: { type: String },
	email: { type: String },
	profile_name: { type: String}
});


const ConnectionSchema = new schema({
	email: { type: String, required: true, trim: true, index: { unique: true } },
	connect: [addFriend]
});


const Connection = mongoose.model('userconnection', ConnectionSchema);
module.exports = Connection;

