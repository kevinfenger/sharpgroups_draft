'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var FantasyTeamSchema = new Schema({
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    fantasyPlayers: [{
        type: Schema.ObjectId,
        ref: 'FantasyPlayer'
    }],
    sharps: { 
        type: Number, 
        default: 2500
    }
},  { 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}); 

mongoose.model('FantasyTeam', FantasyTeamSchema);
