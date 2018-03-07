'use strict';

/**
 * Module dependencies
 */
var qreventsPolicy = require('../policies/qrevents.server.policy'),
  qrevents = require('../controllers/qrevents.server.controller');

module.exports = function (app) {
  // Qrevents Routes
  app.route('/api/qrevents').all(qreventsPolicy.isAllowed)
    .get(qrevents.list)
    .post(qrevents.create);

  app.route('/api/qrevents/:qreventId').all(qreventsPolicy.isAllowed)
    .get(qrevents.read)
    .put(qrevents.update)
    .delete(qrevents.delete);

  app.route('/api/rank')//.all(qreventsPolicy.isAllowed)
    .get(qrevents.rank);

  // Finish by binding the Qrevent middleware
  app.param('qreventId', qrevents.qreventByID);
};
