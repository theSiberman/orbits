'use strict';

/**
 * Module dependencies
 */
var orbitsPolicy = require('../policies/orbits.server.policy'),
  orbits = require('../controllers/orbits.server.controller');

module.exports = function(app) {
  // Orbits Routes
  app.route('/api/orbits').all(orbitsPolicy.isAllowed)
    .get(orbits.list)
    .post(orbits.create);

  app.route('/api/orbits/:orbitId').all(orbitsPolicy.isAllowed)
    .get(orbits.read)
    .put(orbits.update)
    .delete(orbits.delete);

  // Finish by binding the Orbit middleware
  app.param('orbitId', orbits.orbitByID);
};
