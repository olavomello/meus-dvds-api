﻿const express = require("express");

const app = express();

app.use("/api", require("./src/routes"));

app.listen("3001");