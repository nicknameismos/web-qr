'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Qrevent = mongoose.model('Qrevent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Qrevent
 */
exports.create = function (req, res) {
  var qrevent = new Qrevent(req.body);
  qrevent.user = req.user;

  qrevent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrevent);
    }
  });
};

/**
 * Show the current Qrevent
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var qrevent = req.qrevent ? req.qrevent.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  qrevent.isCurrentUserOwner = req.user && qrevent.user && qrevent.user._id.toString() === req.user._id.toString();

  res.jsonp(qrevent);
};

/**
 * Update a Qrevent
 */
exports.update = function (req, res) {
  var qrevent = req.qrevent;

  qrevent = _.extend(qrevent, req.body);

  qrevent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrevent);
    }
  });
};

/**
 * Delete an Qrevent
 */
exports.delete = function (req, res) {
  var qrevent = req.qrevent;

  qrevent.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrevent);
    }
  });
};

/**
 * List of Qrevents
 */
exports.list = function (req, res) {
  Qrevent.find().sort('-created').populate('user', 'displayName').exec(function (err, qrevents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrevents);
    }
  });
};

/**
 * Qrevent middleware
 */
exports.qreventByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Qrevent is invalid'
    });
  }

  Qrevent.findById(id).populate('user', 'displayName').exec(function (err, qrevent) {
    if (err) {
      return next(err);
    } else if (!qrevent) {
      return res.status(404).send({
        message: 'No Qrevent with that identifier has been found'
      });
    }
    req.qrevent = qrevent;
    next();
  });
};

exports.rank = function (req, res) {
  Qrevent.find().sort('-created').populate('user', 'displayName').exec(function (err, qrevents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var ranks = new Qrevent({
        rank: qrevents.length + 1,
        headers: req.headers
      });
      ranks.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(ranks);
        }
      });
    }
  });
};


exports.reports = function (req, res) {
  Qrevent.find().sort('-created').populate('user', 'displayName').exec(function (err, qrevents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var alldate = [];
      qrevents.forEach(function (qr) {
        var str = qr.created.toString();
        var res = str.substr(0, 10);
        if (alldate.indexOf(res) === -1) {
          alldate.push(res);
        }
      });
      var resultdata = [];
      alldate.forEach(function (date) {
        var qrsByDate = qrevents.filter(function (obj) { return obj.created.substr(0, 10).toString() === date.toString() });
        resultdata.push({
          date: date,
          userscount: qrsByDate.length,
          users: qrsByDate
        });
      });
      res.jsonp(resultdata);
    }
  });
};