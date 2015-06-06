'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {type: String, required: true},
    itemId: {type: String, required: true},
    user: { type: mongoose.Schema.ObjectId, ref: 'User' , required: true }
});


module.exports = mongoose.model('Item', schema);