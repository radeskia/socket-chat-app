const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/message_controllers");
const user_controller = require("../controllers/user_controllers");

router
    .get("/", (req, res) => {
        console.log(`okay`);
        res.send(`okay`);
    })
    .get("/asd", (req, res) => {
        console.log(`asd is okay too`);
        res.send(`asd is okay too`);
    })
    .get("/messages", message_controller.getAllMessages)
    .post("/register", user_controller.register);

module.exports = router;
