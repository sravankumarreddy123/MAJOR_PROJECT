const express = require("express");
const routes = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const {saveUrl} = require("../middleware.js");
const userControllers = require("../controllers/user.js");

routes.get("/signup",userControllers.renderSignUpForm);

routes.post("/signup",userControllers.signup);

routes.get("/login",userControllers.renderLoginForm);

routes.post("/login",saveUrl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),userControllers.login);


routes.get("/logout",userControllers.logOut);

module.exports = routes;