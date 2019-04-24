'use strict';

var studentSchema = require('../model/student.model');

module.exports = {  
    savestudentdetails: savestudentdetails,
    listallstudent: listallstudent,
    listspecificstudent: listspecificstudent
};


// save student details
function savestudentdetails(req, res) {
    var studentschema = new studentSchema();
    studentschema.usn = req.body.usn;
    studentschema.name = req.body.name;
    studentschema.semester = req.body.semester;
    studentschema.branch = req.body.branch;

    var upsertQuery = { 'usn': studentschema.usn, 'name': studentschema.name };

    var studentschemaToUpdate = {};
    studentschemaToUpdate = Object.assign(studentschemaToUpdate, studentschema._doc);
    delete studentschemaToUpdate._id;
    studentSchema.findOneAndUpdate(upsertQuery, studentschemaToUpdate, { upsert: true }, function (err, doc) {
        if (err) {
            res.status(500).send({ success: false, error: err.name + ': ' + err.message });
        } else {
            res.send({ message: 'Student deatils saved successfully' });
        }
    });
}


// list all students
function listallstudent(req, res) {
    studentSchema.find({}, { _id: 0, usn: 1, name: 1, semester: 1, branch: 1 }, function (err, studentdetails) {
        res.send(studentdetails);
    });
}

// list specific student by USN
function listspecificstudent(req, res) {
    studentSchema.findOne({ usn: req.swagger.params.usn.value }, function (err, studentdetails) {
        if (err)
            res.send(err);
        res.json(studentdetails);
    });
}

