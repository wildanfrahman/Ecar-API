const db = require("../models");
const User = db.user;

//user controller
exports.getUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { count, rows: Users } = await User.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      totalUsers: count,
      totalPages,
      currentPage: page,
      data: Users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role_Id: user.role_Id,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "gagal mengambil data user" });
  }
};
