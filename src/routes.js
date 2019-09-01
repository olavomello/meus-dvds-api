const express = require("express");
const routes = express.Router();
const movies = require("./controllers/MovieController.js");

// Routes
routes.route("/movies").get( movies.getAll );
routes.route("/movie/:id").get( movies.getId );
routes.route("/movie/busca/:nome").get( movies.getFind );

module.exports = routes;