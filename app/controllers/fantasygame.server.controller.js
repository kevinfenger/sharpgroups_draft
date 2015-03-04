'use strict';

var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
        FantasyPlayer = mongoose.model('FantasyPlayer'), 
        FantasyTeam = mongoose.model('FantasyTeam'), 
        FantasyGame = mongoose.model('FantasyGame'), 
	Draft = mongoose.model('Draft');

exports.create = function(req, res) {
    console.log(req.body);
    var draft = new Draft(req.body.draft); 
    var game = new FantasyGame(req.body.game); 
    console.log(game); 
    var date = new Date(req.body.draft.dt); 
    var time = new Date(req.body.draft.tt); 
    var newDate = new Date(); 
    newDate.setSeconds(time.getSeconds()); 
    newDate.setMinutes(time.getMinutes()); 
    newDate.setHours(time.getHours()); 
    newDate.setMonth(date.getMonth()); 
    newDate.setDate(date.getDate()); 
    newDate.setFullYear(date.getFullYear()); 

    var ft = new FantasyTeam({ owner : req.user._id, sharps : draft.startingSharps });
    ft.save(); 

    draft.draftDate = newDate.toString(); 
    draft.save(function(err) { 
        if (err) { 
           return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
           });
        }
        else { 
           game.commissioner = req.user.id; 
           game.players.push(req.user); 
           game.commissioner = req.user.id;
           game.fantasyTeams.push(ft._id);  
           game.draft = draft._id; 
           game.save(function(err) { 
              if (err) { 
                 return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                 });
              }
              else { 
                 res.jsonp(game);   
              }
           }); 
        }
    }); 
};
