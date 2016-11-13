(function () {
  'use strict';

  angular
    .module('orbits')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Orbits',
      state: 'orbits',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'orbits', {
      title: 'List Orbits',
      state: 'orbits.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'orbits', {
      title: 'Create Orbit',
      state: 'orbits.create'
    });
  }
}());
