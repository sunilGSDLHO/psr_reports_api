const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/telegram", require("./routes/telegram.routes"));

module.exports = app;