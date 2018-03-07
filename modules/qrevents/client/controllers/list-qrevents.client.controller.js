(function () {
  'use strict';

  angular
    .module('qrevents')
    .controller('QreventsListController', QreventsListController);

  QreventsListController.$inject = ['$http', '$scope'];

  function QreventsListController($http, $scope) {
    var vm = this;
    $scope.rrr = 'modules/qrevents/client/img/background/BG_web_thamtu.jpg';
    // vm.qrevents = QreventsService.query();
    $scope.initData = function () {

    };

    // window.onload = function () {
    //   window.localStorage.removeItem('isRef');
    //   console.log(document.referrer);
    // };

    // window.onunload = function () {
    //   window.localStorage.setItem('isRef', true);
    // };

    // window.onbeforeunload = function () {
    //   window.localStorage.setItem('isRef', true);
    // };

    if (window.localStorage.getItem('rank')) {
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

    // $scope.permission = function () {
    //   alert('ss');
    // };


  }
}());
