const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "fail",
        error: "Invalid email or password",
      });
    }

    // USER SESSION
    req.session.userID = user._id;
    res.status(200).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};

const logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
