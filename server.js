require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const home = require("./controllers/home");

const db = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

const app = express();

app.use(cors());
app.use(express.json());

//home --> GET = res is working
app.get("/", (req, res) => home.handleHome(req, res, db));

//signin --> POST = success/fail
app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

//register --> POST = user
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

//profile/:id --> GET = user
app.get("/profile/:id", async (req, res) =>
  profile.handleProfile(req, res, db)
);

//image --> PUT = user
app.post("/imageApi", async (req, res) => image.handleApiCall(req, res));
app.put("/image", async (req, res) => image.handleImage(req, res, db));

app.listen(3001, () => {
  console.log("Server started on port 3001.");
});
