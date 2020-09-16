require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const mongoose = require("mongoose");

// Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log("error in DB connection", err));

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

// Routes
const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("hello world.");
});

//PORT
const port = process.env.PORT || 2500;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
