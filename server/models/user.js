const mongoose = require("mongoose");

const User = mongoose.Schema({
    username: {
        type: String,
        required: [true, "First name is required!"],
    },

    password: {
        type: String,
        required: [true, "Password is required!"],
    },
});

module.exports = mongoose.model("User", User);
