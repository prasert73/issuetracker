const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema ({
    issue_title: {type: String, Required: true},
    issue_text: {type: String, Required: true},
    created_on: Date,
    updated_on: Date,
    created_by: {type: String, Required: true},
    assigned_to: String,
    open: Boolean,
    status_text: String,
    project: {type: String, Required: true}
});

const issueModel = mongoose.model('issues', issueSchema);

module.exports = issueModel;