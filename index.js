// Importing the packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { connectToDatabase } = require("./db/connectToDatabase");
const router = require("./routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(router);

app.listen(4000, console.log("Server started as port 4000"));
