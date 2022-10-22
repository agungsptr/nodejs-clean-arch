const { hashPassword } = require("../../commons/utils");
const mongoose = require("../connection");

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UsersSchema.pre("save", function (next) {
  this.password = hashPassword(this.password);
  return next();
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;