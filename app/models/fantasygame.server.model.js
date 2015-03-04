'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var FantasyGameSchema = new Schema({
    commissioner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    draft: {
        type: Schema.ObjectId,
        ref: 'Draft'
    },
    password: {
        type: String,
        trim: true
    }, 
    maxUsers: { 
        type: Number, 
        default: 8
    },
    name: {
        type: String,
        required: 'Please give your fantasy game a name',
        trim: true
    },  
    isPrivate: { 
        type: Boolean, 
        default: false
    },
    players: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    fantasyTeams: [{
        type: Schema.ObjectId,
        ref: 'FantasyTeam'
    }],
    items: [{
        type: Schema.ObjectId,
        ref: 'FantasyPlayer'
    }]
},  { 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}); 

mongoose.model('FantasyGame', FantasyGameSchema);
