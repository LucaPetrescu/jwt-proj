const express = require("express");
const router = express.Router();
const User = require("../model/user");
const generateJWT = require("../helpers/generateJWT");
const { passwordCrypter, passwordCheck } = require("../helpers/passwordHelper");
const mongoose = require("mongoose");

const days = 225892000;

router.post("/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  const password = passwordCrypter(plainTextPassword);
  console.log("asddassda");
  try {
    // throw new Error();
    const newUser = await User.create({
      username,
      password,
    });

    const accessToken = generateJWT.accessToken(newUser.id, newUser.username);
    const refreshToken = generateJWT.refreshToken(newUser.id, newUser.username);

    res.cookie("refresh-token", refreshToken, {
      expires: new Date(Date.now() + days),
      httpOnly: true,
    });
    res.json({ accessToken });
  } catch (err) {
    console.log("aici", err);
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  try {
    if (passwordCheck) {
      const accessToken = generateJWT.accessToken(user.id, user.username);
      const refreshToken = generateJWT.refreshToken(user.id, user.username);

      res.cookie("refresh-token", refreshToken, {
        expires: new Date(Date.now() + days),
        httpOnly: true,
      });
      //   res.setHeader("Authirization", "Bearer " + accessToken);
      // console.log(req.headers.cookie);
      return res.json(accessToken);
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/refreshToken", async (req, res) => {
  let cookieName = "refresh-token";
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = req.headers.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  let oldRefreshToken = getCookie(cookieName);
  const user = generateJWT.verifyRefreshToken(oldRefreshToken);
  const newRefreshToken = generateJWT.refreshToken(user.id, user.usermane);
  const newAccessToken = generateJWT.accessToken(user.id, user.usermane);
  res.cookie("New Refresh Token", newRefreshToken, {
    expires: new Date(Date.now() + 60),
  });
  res.json({ newAccessToken });
});

router.get("/sendMessage", (req, res) => {
  const authHeader = req.headers["authorization"];
  try {
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    const user = generateJWT.verifyAccessToken(token);
    res.send({});
  } catch (err) {
    res.clearCookie("Refresh Token");
    res.status(401).send(err);
  }
});

router.post("/logout", (req, res) => {
  authHeader = req.headers["authorization"];
  try {
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    const user = generateJWT.verifyAccessToken(token);
    res.clearCookie("Refresh Token");
    res.send({});
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
