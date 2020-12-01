'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * BottleSchema
 */
var TodoSchema = new Schema({
    keyIndex: {
        type: Number,
        required: true,
        default: 0,
    },
    title:{
        type:'string',
    },
    created_at: {
        type: Date,
        default: Date.now
    },
})

mongoose.model('Todos', TodoSchema);