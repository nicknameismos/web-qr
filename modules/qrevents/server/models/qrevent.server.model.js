'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Qrevent Schema
 */
var QreventSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Qrevent name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Qrevent', QreventSchema);
