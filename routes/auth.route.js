const express = require('express');
const {SignupController,LoginController,LogoutController} = require("../controller/auth.controler");

const Route = express.Router();

Route.post("/signup",SignupController)

Route.post("/login",LoginController)

Route.post("/logout",LogoutController)

module.exports = Route;