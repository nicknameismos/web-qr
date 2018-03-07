(function () {
  'use strict';

  // Qrevents controller
  angular
    .module('qrevents')
    .controller('QreventsController', QreventsController);

  QreventsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'qreventResolve'];

  function QreventsController ($scope, $state, $window, Authentication, qrevent) {
    var vm = this;

    vm.authentication = Authentication;
    vm.qrevent = qrevent;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Qrevent
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.qrevent.$remove($state.go('qrevents.list'));
      }
    }

    // Save Qrevent
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.qreventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.qrevent._id) {
        vm.qrevent.$update(successCallback, errorCallback);
      } else {
        vm.qrevent.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('qrevents.view', {
          qreventId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
