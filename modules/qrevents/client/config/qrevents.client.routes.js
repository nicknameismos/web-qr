(function () {
  'use strict';

  angular
    .module('qrevents')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('qrevents', {
        abstract: true,
        url: '/qrevents',
        template: '<ui-view/>'
      })
      .state('qrevents.list', {
        url: '',
        templateUrl: 'modules/qrevents/client/views/list-qrevents.client.view.html',
        controller: 'QreventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Qrevents List'
        }
      })
      .state('qrevents.create', {
        url: '/create',
        templateUrl: 'modules/qrevents/client/views/form-qrevent.client.view.html',
        controller: 'QreventsController',
        controllerAs: 'vm',
        resolve: {
          qreventResolve: newQrevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Qrevents Create'
        }
      })
      .state('qrevents.edit', {
        url: '/:qreventId/edit',
        templateUrl: 'modules/qrevents/client/views/form-qrevent.client.view.html',
        controller: 'QreventsController',
        controllerAs: 'vm',
        resolve: {
          qreventResolve: getQrevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Qrevent {{ qreventResolve.name }}'
        }
      })
      .state('qrevents.view', {
        url: '/:qreventId',
        templateUrl: 'modules/qrevents/client/views/view-qrevent.client.view.html',
        controller: 'QreventsController',
        controllerAs: 'vm',
        resolve: {
          qreventResolve: getQrevent
        },
        data: {
          pageTitle: 'Qrevent {{ qreventResolve.name }}'
        }
      });
  }

  getQrevent.$inject = ['$stateParams', 'QreventsService'];

  function getQrevent($stateParams, QreventsService) {
    return QreventsService.get({
      qreventId: $stateParams.qreventId
    }).$promise;
  }

  newQrevent.$inject = ['QreventsService'];

  function newQrevent(QreventsService) {
    return new QreventsService();
  }
}());
