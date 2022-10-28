const mongoose = require("mongoose");

const Message = mongoose.Schema({
    message: {
        type: String,
        required: [true, "Message content is required!"],
    },
    sender: {
        type: String,
        required: [true, "Message sender is required!"],
    },
    receiver: {
        type: String,
        required: [true, "Message receiver is required!"],
    },
    time: {
        type: String,
        required: [true, "Message timestamp is required!"],
    },
});

module.exports = mongoose.model("Message", Message);
