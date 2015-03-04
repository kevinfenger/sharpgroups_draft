'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var FantasyPlayerSchema = new Schema({
    division: {
        type: String,
        trim: true, 
        default: '', 
    },
    image: {
        type: String,
        trim: true, 
        default: '', 
    },
    name: {
        type: String,
        trim: true, 
        default: '', 
    },
    seed: { 
        type: Number, 
        default: 1
    }
},  { 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}); 

mongoose.model('FantasyPlayer', FantasyPlayerSchema);
