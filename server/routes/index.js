const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/message_controllers");
const user_controller = require("../controllers/user_controllers");
const {
    REGISTER_SCHEMA,
    LOGIN_SCHEMA,
} = require("../schemas/AuthenticationSchemas");
const { validate } = require("../middleware/validate");
const {
    validate_refresh_token,
} = require("../middleware/validate_refresh_token");
const { auth } = require("../middleware/validate_access_token");

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
    .get("/auth", auth, (req, res) => {
        res.send("Authed, working!");
    })
    .get("/notAuth", (req, res) => {
        res.send("Not authed route");
    })

    //User routes
    .post("/register", validate(REGISTER_SCHEMA), user_controller.register)
    .post("/login", validate(LOGIN_SCHEMA), user_controller.login)
    .post("/refresh", validate_refresh_token, user_controller.refresh)

    //Message routes
    .get("/messages", auth, message_controller.getAllMessages)

    // Chats routes
    .get("/users/", auth, user_controller.get_users)
    .get("/chats/:fromUser/:toUser", auth, message_controller.chatBetween);

module.exports = router;
