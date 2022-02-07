const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();

const app = express();

const db = require("./helpers/keys").MongoURI;

const routes = require("./routes/routes");

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/static", express.static(path.join(__dirname, "static")));

app.use("/auth", routes);

const PORT = process.env.PORT || 8000;

//Pornirea serverului
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
