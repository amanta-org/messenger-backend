const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    realName: {
        type: String,
        immutable: false,
        default: 'new user'
    },
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
    },
    //if avatar == empty show pokemonHero As Avatar
    pokemonHero: {
        type: String,
        immutable: false,
        default: ''
    },
    bio: {
        type: String,
        immutable: false,
    },
    lastSeen: {
        type: String,
        immutable: false,
    },
    groups: {
        type: String,
        immutable: false,
        default: ''
    },
    pvs: {
        type: String,
        immutable: false,
        default: ''
    }
})
const userTable = mongoose.model('user', msgSchema);
module.exports = userTable;

