const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    realName: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    //text,emoji,image,sticker,lottie
    messageType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    edited: {
        type: Boolean,
        immutable: false,
    },
    deleted: {
        type: Boolean,
        immutable: false,
    },
})
const messageTable = mongoose.model('msg', msgSchema);
module.exports = messageTable;

