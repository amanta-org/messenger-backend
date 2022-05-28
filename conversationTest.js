const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
    },
})
const messageTable = mongoose.model('msg', msgSchema);
module.exports = messageTable;

