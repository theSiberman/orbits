'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Orbit = mongoose.model('Orbit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Orbit
 */
exports.create = function(req, res) {
  var orbit = new Orbit(req.body);
  orbit.user = req.user;

  orbit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orbit);
    }
  });
};

/**
 * Show the current Orbit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var orbit = req.orbit ? req.orbit.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  orbit.isCurrentUserOwner = req.user && orbit.user && orbit.user._id.toString() === req.user._id.toString();

  res.jsonp(orbit);
};

/**
 * Update a Orbit
 */
exports.update = function(req, res) {
  var orbit = req.orbit;

  orbit = _.extend(orbit, req.body);

  orbit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orbit);
    }
  });
};

/**
 * Delete an Orbit
 */
exports.delete = function(req, res) {
  var orbit = req.orbit;

  orbit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orbit);
    }
  });
};

/**
 * List of Orbits
 */
exports.list = function(req, res) {
  Orbit.find().sort('-created').populate('user', 'displayName').exec(function(err, orbits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orbits);
    }
  });
};

/**
 * Orbit middleware
 */
exports.orbitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Orbit is invalid'
    });
  }

  Orbit.findById(id).populate('user', 'displayName').exec(function (err, orbit) {
    if (err) {
      return next(err);
    } else if (!orbit) {
      return res.status(404).send({
        message: 'No Orbit with that identifier has been found'
      });
    }
    req.orbit = orbit;
    next();
  });
};
