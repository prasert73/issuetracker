'use strict';

const issueModel = require ('../model');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      // Object.assign(req.query);
      // let filterObj = Object.assign(req.query); //alternative
      // filter can't include undefined, not able to assign all query parameter to object.
      let { _id, assigned_to, status_text, open, issue_title, issue_text, created_by, created_on, updated_on } = req.query;
      let filterObj = {};
      if (_id) {filterObj._id = _id};
      if (assigned_to) {filterObj.assigned_to = assigned_to};
      if (status_text) {filterObj.status_text = status_text};
      if (open  != undefined) {filterObj.open = open};
      if (issue_title) {filterObj.issue_title = issue_title};
      if (issue_text) {filterObj._issue_text = issue_text};
      if (created_by) {filterObj.created_by = created_by};
      if (created_on) {filterObj.created_on = created_on};
      if (updated_on) {filterObj.updated_on = updated_on};
      filterObj.project = project;
      issueModel.find(filterObj, (error, issuesFound)=>{
        if (!error) {return res.json(issuesFound)}
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({error: 'required field(s) missing'})
      } else {
        let newIssue = new issueModel({
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          open: true,
          created_on: new Date(),
          updated_on: new Date(),
          project
        });
        newIssue.save((error, savedissue)=>{
          if (!error) {return res.json({
          assigned_to: savedissue.assigned_to,
          status_text: savedissue.status_text,
          open: savedissue.open,
          _id: savedissue._id,
          issue_title: savedissue.issue_title,
          issue_text: savedissue.issue_text,
          created_by: savedissue.created_by,
          created_on: savedissue.created_on,
          updated_on: savedissue.updated_on
          })};
        });
      }
    })

    .put(function (req, res){
      let project = req.params.project;
      let updateObj = {};
      Object.keys(req.body).forEach((key)=>{
        if (req.body[key] != '') {
        updateObj[key]=req.body[key];
        }
      });
      console.log(req.body)
      if (!req.body._id) {return res.json({ error: 'missing _id' })};
      if (Object.keys(updateObj).length < 2) {
        return res.json({error: 'no update field(s) sent', _id: req.body._id})
      }
      updateObj.updated_on = new Date();
      console.log(updateObj)
      issueModel.findByIdAndUpdate(req.body._id, updateObj, { new: true }, (error, updatedData)=>{
        if (!error && updatedData) {
          return res.json({ result: 'successfully updated',_id: req.body._id })
        } else {
          return res.json({ error: 'could not update', _id: req.body._id })
        }
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if (!req.body._id) {return res.json({ error: 'missing _id'})}
      issueModel.findByIdAndRemove(req.body._id, (error, deletedissue)=>{
        if (!error && deletedissue) {
          return res.json({ result: 'successfully deleted', _id: req.body._id})
        } else {
          return res.json({ error: 'could not delete', _id: req.body._id })
        }
      })
    });
    
};
