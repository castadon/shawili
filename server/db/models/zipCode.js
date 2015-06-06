'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    zipCode: {type: String, required: true},
    city: {type: String, required: true},
    loc: [{type: Number}],
    pop: {type: String, required: true},
    state: {type: String, required: true}
});


module.exports = mongoose.model('ZipCode', schema);