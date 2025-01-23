const { authJwt } = require("../middleware");
const controller = require("../controllers/cart.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //cart
  app.post("/api/cart/:car_id", [authJwt.verifyToken], controller.addCart); //create cart

  app.get("/api/cart", [authJwt.verifyToken], controller.readCart); //create cart

  app.put("/api/cart/:carts_id", [authJwt.verifyToken], controller.updateCart); //update cart

  app.delete("/api/cart/:carts_id", [authJwt.verifyToken], controller.deleteCart); //delete cart
};
