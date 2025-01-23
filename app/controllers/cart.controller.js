const db = require("../models");
const Car = db.car;
const Cart = db.cart;

//cart controller
exports.addCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { car_id } = req.params;
    const { quantity } = req.body;
    const car = await Car.findByPk(car_id);
    if (!car) {
      return res.status(404).json({ message: "mobil tidak ditemukan" });
    }

    const total_Price = car.car_price * (quantity || 1);
    const cartItem = await Cart.create({
      user_id: userId,
      car_id,
      quantity: quantity || 1,
      total_price: total_Price,
    });

    res.status(201).json({
      message: "mobil berhasil ditambahkan ke keranjang",
      cartItem: {
        ...cartItem.dataValues,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "gagal menambah data" });
  }
};

exports.readCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Car,
          as: "car",
          attributes: ["car_name", "car_price"],
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "keranjang kosong" });
    }

    const totalCartPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * item.car.car_price;
    }, 0);

    res.status(200).json({
      message: "Keranjang berhasil diambil.",
      cartItems: cartItems.map((item) => ({
        id: item.id,
        car_name: item.car.car_name,
        quantity: item.quantity,
        car_price: item.car.car_price,
        total_price_per_item: item.quantity * item.car.car_price,
      })),
      totalCartPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data keranjang." });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { action } = req.body;
    const { carts_id } = req.params;
    const cartItem = await Cart.findByPk(carts_id);

    if (!cartItem) {
      return res.status(404).json({ message: "item keranjang tidak ditemukan" });
    }

    const car = await Car.findByPk(cartItem.car_id);
    if (!car) {
      return res.status(404).json({ message: "mobil terkait tidak ditemukan" });
    }
    // Memperbarui quantity berdasarkan aksi yang diambil
    if (action === "increase") {
      cartItem.quantity += 1; // Jika aksi "tambah"
    } else if (action === "decrease" && cartItem.quantity > 1) {
      cartItem.quantity -= 1; // Jika aksi "kurangi" dan quantity lebih dari 1
    } else if (action === "decrease" && cartItem.quantity === 1) {
      return res.status(400).json({ message: "quantity minimal 1" });
    } else {
      return res.status(400).json({ message: "aksi tidak valid" });
    }
    // Menghitung ulang total price berdasarkan quantity baru
    cartItem.total_price = car.car_price * cartItem.quantity;
    // Menyimpan perubahan di database
    await cartItem.save();

    res.status(200).json({
      message: "keranjang berhasil diperbarui",
      cartItem: {
        ...cartItem.dataValues,
      },
    });
  } catch (error) {
    console.error();
    res.status(500).json({ message: "gagal memperbarui keranjang" });
  }
};

//delete cart
exports.deleteCart = async (req, res) => {
  try {
    const { carts_id } = req.params;
    const cartItem = await Cart.findByPk(carts_id);

    if (!cartItem) {
      return res.status(404).json({ message: "item keranjang tidak ditemukan" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "item keranjang berhasil dihapus" });
  } catch {
    res.status(500).json({ message: "gagal menghapus item keranjang" });
  }
};
