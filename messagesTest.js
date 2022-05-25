const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
})
const messageTable = mongoose.model('msg', msgSchema);
module.exports = messageTable;

