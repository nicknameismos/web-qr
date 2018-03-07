(function () {
  'use strict';

  angular
    .module('qrevents')
    .controller('QreventsListController', QreventsListController);

  QreventsListController.$inject = ['$http', '$scope'];

  function QreventsListController($http, $scope) {
    var vm = this;
    // vm.qrevents = QreventsService.query();
    $scope.initData = function () {

    };

    window.onload = function () {
      window.localStorage.removeItem('isRef');
    };
    window.onunload = function () {
      window.localStorage.setItem('isRef', true);
    };

    if (window.localStorage.getItem('isRef')) {
      console.log(false);
    } else {
      console.log(true);
      $http.get("/api/rank")
        .then(function (response) {
          window.localStorage.setItem('rank', JSON.stringify(response.data.rank));

          console.log(response.data.rank);
        });
    }
    $scope.rank = function () {
      return window.localStorage.getItem('rank');
    };

  }
}());
