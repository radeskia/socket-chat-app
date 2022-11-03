const mongoose = require("mongoose");

const User = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required!"],
    },
    last_name: {
        type: String,
        required: [true, "Last name is required!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
});

module.exports = mongoose.model("User", User);
