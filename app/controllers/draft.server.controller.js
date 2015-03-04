'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
        FantasyPlayer = mongoose.model('FantasyPlayer'), 
        FantasyTeam = mongoose.model('FantasyTeam'), 
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
    var ft = new FantasyTeam({ owner : req.user._id, sharps : draft.startingSharps });
    ft.save();
    draft.fantasyTeams.push(ft._id); 
    // TODO Just for testing  
             var fp1 = new FantasyPlayer({ division : 'West', image : '/modules/drafts/img/air_force_falcons_logo.png', name : 'Air Force', seed : 1});
             fp1.save(); 
             draft.items.push(fp1);  
             fp1 = new FantasyPlayer({ division : 'West', image : '/modules/drafts/img/acu_wildcats_logo.png', name : 'Wildcats', seed : 15}); 
             fp1.save(); 
             draft.items.push(fp1);  
             fp1 = new FantasyPlayer({ division : 'West', image : '/modules/drafts/img/aic_yellowjackets_logo.png', name : 'Yellowjackets', seed : 12}); 
             fp1.save(); 
             draft.items.push(fp1);  
    // End testing 
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
    Draft.findById(draft._id, function(err, doc) { 
       if (err) { 
          return res.status(400).send({ 
              message: errorHandler.getErrorMessage(err) 
          }); 
       }
       else { 
          if (doc.players.addToSet(userId).length > 0) { 
             console.log('adding player');
             // create and add a FantasyTeam to this draft
             var ft = new FantasyTeam({ owner : userId, sharps : doc.startingSharps });
             ft.save(); 
             doc.fantasyTeams.push(ft._id); 
             doc.save(); 
          } 
          // else trying to join again, do nothing??
          res.jsonp(doc); 
       } 
    }); 
};

exports.draftById = function(req, res, next, id) { 
    Draft.findById(id).populate('fantasyTeams players items').exec(function(err, doc) {
       if (err) 
          return next(err);  

       if (!doc)
          return next(new Error('Draft Does Not Exist with id ' + id)); 
       req.draft = doc;
       next(); 
    }); 
}; 

exports.canEnter = function (req, res, next) { 
    console.log('test can enter');
    next(); 
}; 

exports.getInformation = function (req, res) { 
    console.log('test2 get info');
    res.jsonp(req.draft); 
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
