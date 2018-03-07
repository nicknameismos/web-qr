(function () {
  'use strict';

  angular
    .module('qrevents')
    .controller('QreventsListController', QreventsListController);

  QreventsListController.$inject = ['QreventsService'];

  function QreventsListController(QreventsService) {
    var vm = this;

    vm.qrevents = QreventsService.query();
  }
}());
