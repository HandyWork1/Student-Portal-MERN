
const mongoose = require('mongoose');
const usersTypes = require('./usertypes');

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType: {
    type: String,
    enum: Object.values(usersTypes),
    default: 'Student',
  },
  courseId: { type: String }
});

const usersmodel = mongoose.model("Users", usersSchema);
module.exports = usersmodel;
