const express = require("express");
const mongoose = require("mongoose");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");

const app = express();

//database
mongoose.connect("mongodb://127.0.0.1:27017/smartedu-db").then(() => {
  console.log("Database connected");
});

//template engine
app.set("view engine", "ejs");

//Middleware
app.use(express.static("public"));
//req.body
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Routes
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
