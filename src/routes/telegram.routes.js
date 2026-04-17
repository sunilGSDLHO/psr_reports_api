const express = require("express");
const router = express.Router();
const controller = require("../controllers/telegram.controller");

router.post("/webhook", controller.webhook);

module.exports = router;