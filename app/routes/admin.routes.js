const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  //create admin
  app.post("/api/admin/signup", [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateUsernameOrEmail], controller.createAdmin);
};
