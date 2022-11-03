const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/message_controllers");
const user_controller = require("../controllers/user_controllers");
const {
    REGISTER_SCHEMA,
    LOGIN_SCHEMA,
} = require("../schemas/AuthenticationSchemas");
const { validate } = require("../validations/validate");

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
    .post("/register", validate(REGISTER_SCHEMA), user_controller.register)
    .post("/login", validate(LOGIN_SCHEMA), user_controller.login)
    .get("/users/", user_controller.get_users)
    .get("/chats/:fromUser/:toUser", message_controller.chatBetween);

module.exports = router;
