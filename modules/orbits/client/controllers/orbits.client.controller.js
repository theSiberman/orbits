(function () {
  'use strict';

  // Orbits controller
  angular
    .module('orbits')
    .controller('OrbitsController', OrbitsController);

  OrbitsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'orbitResolve'];

  function OrbitsController ($scope, $state, $window, Authentication, orbit) {
    var vm = this;

    vm.authentication = Authentication;
    vm.orbit = orbit;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Orbit
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.orbit.$remove($state.go('orbits.list'));
      }
    }

    // Save Orbit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.orbitForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.orbit._id) {
        vm.orbit.$update(successCallback, errorCallback);
      } else {
        vm.orbit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('orbits.view', {
          orbitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
