'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var DraftSchema = new Schema({
    commissioner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    draftDate: {
        type: Date,
        required: 'Your draft needs a start time',
        default: Date.now
    },
    draftName: {
        type: String,
        required: 'Please give your draft a name',
        trim: true
    }, 
    draftType: { 
        type: Number, 
        default: 0
    },
    leaguePassword: {
        type: String,
        trim: true
    }, 
    maxUsers: { 
        type: Number, 
        default: 8
    },
    minSharpBidIncrease: { 
        type: Number, 
        default: 10
    },
    isPrivate: { 
        type: Boolean, 
        default: false
    },
    players: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    startingSharps: { 
        type: Number, 
        default: 2500
    }
},  { 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}); 


DraftSchema.methods.findDraftsByType = function(dt, cb) { 
    return this.model('Draft').find({ draftType: dt }, cb); 
//    return 'test'; 
}; 

mongoose.model('Draft', DraftSchema);
