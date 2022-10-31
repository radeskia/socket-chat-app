const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/message_controllers");
const user_controller = require("../controllers/user_controllers");

router
    //Test routes
    .get("/", (req, res) => {
        console.log(`okay`);
        res.send(`okay`);
    })
    .get("/asd", (req, res) => {
        console.log(`asd is okay too`);
        res.send(`asd is okay too`);
    })

    //Message routes
    .get("/messages", message_controller.getAllMessages)

    //User routes
    .post("/register", user_controller.register)
    .post("/login", user_controller.login)
    .get("/users/", user_controller.get_users)
    .get("/chats/:fromUser/:toUser", message_controller.chatBetween);

module.exports = router;
