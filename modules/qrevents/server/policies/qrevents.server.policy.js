'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Qrevents Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/qrevents',
      permissions: '*'
    }, {
      resources: '/api/qrevents/:qreventId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/qrevents',
      permissions: ['get', 'post']
    }, {
      resources: '/api/qrevents/:qreventId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/qrevents',
      permissions: ['get']
    }, {
      resources: '/api/qrevents/:qreventId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Qrevents Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Qrevent is being processed and the current user created it then allow any manipulation
  if (req.qrevent && req.user && req.qrevent.user && req.qrevent.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
