// Orbits service used to communicate Orbits REST endpoints
(function () {
  'use strict';

  angular
    .module('orbits')
    .factory('OrbitsService', OrbitsService);

  OrbitsService.$inject = ['$resource'];

  function OrbitsService($resource) {
    return $resource('api/orbits/:orbitId', {
      orbitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
