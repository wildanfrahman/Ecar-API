const { authJwt } = require("../middleware");
const controller = require("../controllers/car.controller");
const upload = require("../middleware/mutler");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  //car controller
  app.post("/api/car", [authJwt.verifyToken, authJwt.isAdmin], upload.single("car_img"), controller.createCar); //create car

  app.get("/api/car", controller.readCar); //read car

  app.get("/api/car/:id", controller.readCarById); // read car by id

  app.put("/api/car/:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single("car_img"), controller.updateCar); //update car

  app.delete("/api/car/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCar); //delete car
};
