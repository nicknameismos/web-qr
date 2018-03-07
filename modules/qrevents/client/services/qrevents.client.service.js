// Qrevents service used to communicate Qrevents REST endpoints
(function () {
  'use strict';

  angular
    .module('qrevents')
    .factory('QreventsService', QreventsService);

  QreventsService.$inject = ['$resource'];

  function QreventsService($resource) {
    return $resource('api/qrevents/:qreventId', {
      qreventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
