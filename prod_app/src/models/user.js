const mongoose = require('mongoose');
const validator = require('validator');
const { checkUppercase } = require('../utils/utils');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required field!"],
        trim: true,
        minlength: [5, "Username must contain 5 or more letters"],
        validate: [
            {
                validator: checkUppercase, message: "Username must contain one uppercase letter"
            }
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required field!"],
        trim: true,
        minlength: [5, "Password must contain 5 or more letters"],
    }
});

userSchema.statics.FindByCredentials = async (username, pass) => {
    if(!username) {
        throw new Error('Please provide username');
    }
    if(!pass) {
        throw new Error('Please provide password');
    }
    const user = await User.findOne({
        username,
        password: pass
    });
    if(!user){
        throw new Error('User not found! Please register an account');
    }
    return user;
}

userSchema.virtual('items', {
    ref: "Items",
    localField: '_id',
    foreignField: "usersId"
});

userSchema.virtual('requests', {
    ref: "Items",
    localField: '_id',
    foreignField: "requestUserId"
});

const User = mongoose.model('User', userSchema);

module.exports = User;