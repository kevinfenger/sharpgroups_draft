'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
	Draft = mongoose.model('Draft');

exports.create = function(req, res) {
    console.log(req.body);
    var date = new Date(req.body.dt); 
    var time = new Date(req.body.tt); 
    var newDate = new Date(); 
    newDate.setSeconds(time.getSeconds()); 
    newDate.setMinutes(time.getMinutes()); 
    newDate.setHours(time.getHours()); 
    newDate.setMonth(date.getMonth()); 
    newDate.setDate(date.getDate()); 
    newDate.setFullYear(date.getFullYear()); 
    var draft = new Draft(req.body);
    draft.players.push(req.user);
    draft.commissioner = req.user.id;
    draft.draftDate = newDate.toString(); 
    draft.save(function(err) { 
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } 
        else {
            res.jsonp(draft);
        }
    }); 
};

exports.findUserDrafts = function(req, res) {
    console.log(req.user.id); 
    Draft.find({ players : {  _id : req.user._id } }).sort('draftDate').populate('draftName, draftDate, commissioner').exec(function(err, drafts) {
        if (err) {
            return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        } else {
            res.jsonp(drafts);
        }
    });
};

exports.list = function(req, res) {
    Draft.find({ 'draftType' : 0, 'players' : { $ne : req.user.id } }).sort('-created').populate('draftName, commissioner').exec(function(err, drafts) {
        if (err) {
            return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        } else {
            console.log(drafts); 
            res.jsonp(drafts);
        }
    });
};

exports.update = function(req, res) {
    var draft = req.draft;
    draft = _.extend(draft, req.body); 
    draft.save(function(err) { 
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } 
        else {
            res.jsonp(draft);
        }
    }); 
};

exports.join = function(req, res) {
    var draft = req.body;
    var userId = req.user._id; 
    Draft.findByIdAndUpdate(draft._id, { $addToSet: { players : userId } }, function(err, doc) { 
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } 
        else {
            res.jsonp(doc);
        }
    });   
};

//exports.enter = function(req, res) { 
//    var sio = req.app.get('socketio'); 
//    sio.sockets.emit('draft.entered', req.user);
//    res.jsonp({success : 1}); 
//};
/*exports.list = function(req, res) {
        console.log('test'); 
    var draft = new Draft();  
    draft.findDraftsByType(0, function (err, drafts) { 
        res.jsonp(drafts); 
    });
};*/ 
