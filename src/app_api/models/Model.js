
var Mongoose = require('mongoose');

exports.ContactSchema = new Mongoose.Schema({
	user: { type: String },
    fullName: { type: String },
    email: { type: String },
    interest: {type: String},
    message: { type: String }
});
