const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/routes");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:4200"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

mongoose
  .connect("mongodb://localhost:27017/jwtauth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
    app.listen(5000, () => {
      console.log("Server has started");
    });
  })
  .catch(() => {
    console.log("Error occured while connecting to database");
  });
