require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//db
const db = require("./models");
const Role = db.role;

db.sequelize.sync({ force: false, alter: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

//initial user
function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" },
  });

  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "admin" },
  });
}

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/car.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/admin.routes")(app);

// set port, listen for requests

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
