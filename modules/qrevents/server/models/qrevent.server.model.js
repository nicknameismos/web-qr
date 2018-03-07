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
  rank: Number,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  headers: {
    host: String,
    connection: String,
    accept: String,
    cookie: String,
    'user-agent': String,
    'accept-language': String,
    referer: String,
    'accept-encoding': String,
    'x-request-id': String,
    'x-forwarded-for': String,
    'x-forwarded-proto': String,
    'x-forwarded-port': String,
    via: String,
    'connect-time': String,
    'x-request-start': String,
    'total-route-time': String
  }
});

mongoose.model('Qrevent', QreventSchema);
