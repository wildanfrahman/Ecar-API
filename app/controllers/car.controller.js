const db = require("../models");
const Car = db.car;

//car controller
//create
exports.createCar = async (req, res) => {
  try {
    const { car_name, car_desc, car_spec, car_price } = req.body;
    const car_img = req.file ? req.file.filename : null;
    const newCar = await Car.create({ car_name, car_img, car_desc, car_spec, car_price });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    res.status(201).json({
      message: "data mobil berhasil ditambah",
      data: {
        car_name: newCar.car_name,
        car_desc: newCar.car_desc,
        car_spec: newCar.car_spec,
        car_price: newCar.car_price,
        car_img: car_img ? `${baseUrl}/uploads/${car_img}` : null, // URL gambar
      },
    });
  } catch (error) {
    res.status(500).json({ message: "gagal menambah data mobil" });
  }
};

exports.readCar = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { count, rows: Cars } = await Car.findAndCountAll({
      limit,
      offset,
    });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      totalItems: count,
      totalPages,
      currentPage: page,
      data: Cars.map((car) => ({
        car_id: car.car_id,
        car_name: car.car_name,
        car_desc: car.car_desc,
        car_spec: car.car_spec,
        car_price: car.car_price,
        car_img: car.car_img ? `${baseUrl}/uploads/${car.car_img}` : null,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "gagal mengambil data mobil" });
  }
};

exports.readCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }

    const carData = {
      car_id: car.car_id,
      car_name: car.car_name,
      car_desc: car.car_desc,
      car_spec: car.car_spec,
      car_price: car.car_price,
      car_img: car.car_img ? `${baseUrl}/uploads/${car.car_img}` : null,
    };

    res.status(200).json({
      message: "data mobil berhasil diambil",
      data: carData,
    });
  } catch {
    console.log(error);
    res.status(500).json({ message: "gagal mengambil data mobil" });
  }
};

//update
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { car_name, car_desc, car_spec, car_price } = req.body;
    const car_img = req.file ? req.file.filename : null;
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }
    await car.update({
      car_name: car_name || car.car_name,
      car_desc: car_desc || car.car_desc,
      car_spec: car_spec || car.car_spec,
      car_price: car_price || car.car_price,
      car_img: car_img || car.car_img,
    });
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    res.status(201).json({
      message: "data mobil berhasil di update",
      data: {
        car_name: car.car_name,
        car_desc: car.car_desc,
        car_spec: car.car_spec,
        car_price: car.car_price,
        car_img: car_img ? `${baseUrl}/uploads/${car_img}` : `${baseUrl}/uploads/${car_img}`, // URL gambar
      },
    });
  } catch (error) {
    res.status(500).json({ message: "gagal mengupdate data mobil" });
  }
};

//delete
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }
    await car.destroy();
    res.status(200).json({ message: "data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "gagal menghapus data mobil" });
  }
};
