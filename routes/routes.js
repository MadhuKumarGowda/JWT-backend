const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

router.post("/register", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const record = await User.findOne({ email: email });

  if (record) {
    return res.status(400).send({
      message: "Email has already registered",
    });
  } else {
    const user = new User({
      name: name,
      email: email,
      password: hashedpassword,
    });
    const result = await user.save();

    // JWT Token

    const { _id } = await result.toJSON();
    const token = jwt.sign({ _id: _id }, "SECRET");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 10000, // one day in miliseconds
    });
    res.send({ message: "registered succesfully" });
  }
});

router.post("/login", async (req, res) => {
  await res.send("user logged in");
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "SECRET");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated 52",
      });
    }

    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: "unauthenticated 61",
    });
  }
});

router.post("/logout", async (req, res) => {
  await res.send("user logged out");
});

module.exports = router;
