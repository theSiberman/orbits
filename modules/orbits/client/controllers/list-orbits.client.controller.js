(function () {
  'use strict';

  angular
    .module('orbits')
    .controller('OrbitsListController', OrbitsListController);

  OrbitsListController.$inject = ['OrbitsService'];

  function OrbitsListController(OrbitsService) {
    var vm = this;

    vm.orbits = OrbitsService.query();
  }
}());
