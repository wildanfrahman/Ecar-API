const db = require("../models");
const User = db.user;

var bcrypt = require("bcryptjs");

exports.createAdmin = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role_Id: 2,
  })
    .then(() => {
      res.send({ message: "Admin was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
