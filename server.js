const express   =   require("express");
const app       =   express();

// Routes
app.use("/api", require("./src/routes"));
// Start
app.listen("3001");