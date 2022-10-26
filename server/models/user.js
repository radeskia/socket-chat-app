const mongoose = require("mongoose");

const User = mongoose.Schema({
    email: {
        type: String,
        required: [true, "First name is required!"],
    },
    avatar: {
        type: String,
        required: [true, "Avatar URL is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
});

module.exports = mongoose.model("User", User);
