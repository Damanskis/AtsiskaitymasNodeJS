const mongoose = require('mongoose');
const validator = require('validator');
const { checkUppercase } = require('../utils/utils');

const itemsSchema = new mongoose.Schema({
    image: {
        type: String
    },
    usersId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'User'
    },
    requestStatus: {
        type: String,
        enum: ["accepted", "declined", "not_requested", "requested"]
    },
    requestUserId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'User'
    },
});

itemsSchema.virtual('requests', {
    ref: "Requests",
    localField: '_id',
    foreignField: "itemId"
});

const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;