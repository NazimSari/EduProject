const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Course = require("../models/Course");
const User = require("../models/User");

dotenv.config();

const getIndexPage = async (req, res) => {
  const courses = await Course.find().sort("-createdAt").limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses, // index sayfasında yakalamak için.
    totalStudents,
    totalTeachers,
  });
};

const getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

const getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};
const getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};
const getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};
const sendEmail = async (req, res) => {
  try {
    const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
  `;

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER, //gmail account
        pass: process.env.NODEMAILER_PASS, //gmail password
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Smart EDU contact" <digitalistway@gmail.com>', // sender address
        to: process.env.NODEMAILER_USER, // list of receivers
        subject: "Smart EDU Contact Form New Message", // Subject line
        html: outputMessage, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    req.flash("success", "Message sent successfully");
    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", `Something went wrong`);
    res.status(400).redirect("contact");
  }
};

module.exports = {
  getAboutPage,
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getContactPage,
  sendEmail,
};
