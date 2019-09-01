const express = require("express");
const routes = express.Router();
const movies = require("./controllers/MovieController.js");

routes.route("/movies")
    .get(movies.getAllItems);

module.exports = routes;