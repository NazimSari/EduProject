const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const { validationResult } = require("express-validator");
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);

    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }
    res.status(201).redirect("/register");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // USER SESSION
        req.session.userID = user._id;
        return res.status(200).redirect("/users/dashboard");
      } else {
        req.flash("error", "Your password or email is not correct!");
        return res.status(400).redirect("/login");
      }
    } else {
      req.flash("error", "User is not found!");
      return res.status(400).redirect("/login");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

const getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses"
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user, //dashboard.ejs içinde yakalamak için.
    categories,
    courses,
    users,
  });
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({ user: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getDashboardPage,
  deleteUser,
};
