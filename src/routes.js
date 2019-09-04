const express = require("express");
const routes = express.Router();
const movies = require("./controllers/MovieController.js");

// Routes
routes.route("/movies").get( movies.getAll );
routes.route("/movie/:id").get( movies.getId );
routes.route("/movie/find/:name").get( movies.getFind );
routes.route("/movies/genre/:name").get( movies.getGenre );
routes.route("/genres").get( movies.getGenres );

module.exports = routes;