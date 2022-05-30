const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    //base64 data image
    data: {
        type: String,
        immutable: false,
        default: ''
    },
})
const imageTable = mongoose.model('imgs', msgSchema);
module.exports = imageTable;

