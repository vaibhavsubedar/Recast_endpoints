'use strict';
const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    usn: String,
    name: String,
    semester: String,
    branch: String   
}, { _id: false });

module.exports = mongoose.model('StudentSchema', studentSchema);