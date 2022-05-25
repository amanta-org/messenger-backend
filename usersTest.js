const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        immutable: false,
        default: ''
    }
})
const userTable = mongoose.model('user', msgSchema);
module.exports = userTable;

