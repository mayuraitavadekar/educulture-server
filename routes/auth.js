const express = require("express");
const router = require("express").Router();

//here,  calling some controllers after hitting the routes
const { register, login } = require("../controllers/auth");

router.post("/register", register);

router.post("/login", login);

module.exports = router;
