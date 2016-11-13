(function () {
  'use strict';

  angular
    .module('orbits')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('orbits', {
        abstract: true,
        url: '/orbits',
        template: '<ui-view/>'
      })
      .state('orbits.list', {
        url: '',
        templateUrl: 'modules/orbits/client/views/list-orbits.client.view.html',
        controller: 'OrbitsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Orbits List'
        }
      })
      .state('orbits.create', {
        url: '/create',
        templateUrl: 'modules/orbits/client/views/form-orbit.client.view.html',
        controller: 'OrbitsController',
        controllerAs: 'vm',
        resolve: {
          orbitResolve: newOrbit
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Orbits Create'
        }
      })
      .state('orbits.edit', {
        url: '/:orbitId/edit',
        templateUrl: 'modules/orbits/client/views/form-orbit.client.view.html',
        controller: 'OrbitsController',
        controllerAs: 'vm',
        resolve: {
          orbitResolve: getOrbit
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Orbit {{ orbitResolve.name }}'
        }
      })
      .state('orbits.view', {
        url: '/:orbitId',
        templateUrl: 'modules/orbits/client/views/view-orbit.client.view.html',
        controller: 'OrbitsController',
        controllerAs: 'vm',
        resolve: {
          orbitResolve: getOrbit
        },
        data: {
          pageTitle: 'Orbit {{ orbitResolve.name }}'
        }
      });
  }

  getOrbit.$inject = ['$stateParams', 'OrbitsService'];

  function getOrbit($stateParams, OrbitsService) {
    return OrbitsService.get({
      orbitId: $stateParams.orbitId
    }).$promise;
  }

  newOrbit.$inject = ['OrbitsService'];

  function newOrbit(OrbitsService) {
    return new OrbitsService();
  }
}());
