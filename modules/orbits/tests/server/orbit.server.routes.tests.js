'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Orbit = mongoose.model('Orbit'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  orbit;

/**
 * Orbit routes tests
 */
describe('Orbit CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Orbit
    user.save(function () {
      orbit = {
        name: 'Orbit name'
      };

      done();
    });
  });

  it('should be able to save a Orbit if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Orbit
        agent.post('/api/orbits')
          .send(orbit)
          .expect(200)
          .end(function (orbitSaveErr, orbitSaveRes) {
            // Handle Orbit save error
            if (orbitSaveErr) {
              return done(orbitSaveErr);
            }

            // Get a list of Orbits
            agent.get('/api/orbits')
              .end(function (orbitsGetErr, orbitsGetRes) {
                // Handle Orbits save error
                if (orbitsGetErr) {
                  return done(orbitsGetErr);
                }

                // Get Orbits list
                var orbits = orbitsGetRes.body;

                // Set assertions
                (orbits[0].user._id).should.equal(userId);
                (orbits[0].name).should.match('Orbit name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Orbit if not logged in', function (done) {
    agent.post('/api/orbits')
      .send(orbit)
      .expect(403)
      .end(function (orbitSaveErr, orbitSaveRes) {
        // Call the assertion callback
        done(orbitSaveErr);
      });
  });

  it('should not be able to save an Orbit if no name is provided', function (done) {
    // Invalidate name field
    orbit.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Orbit
        agent.post('/api/orbits')
          .send(orbit)
          .expect(400)
          .end(function (orbitSaveErr, orbitSaveRes) {
            // Set message assertion
            (orbitSaveRes.body.message).should.match('Please fill Orbit name');

            // Handle Orbit save error
            done(orbitSaveErr);
          });
      });
  });

  it('should be able to update an Orbit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Orbit
        agent.post('/api/orbits')
          .send(orbit)
          .expect(200)
          .end(function (orbitSaveErr, orbitSaveRes) {
            // Handle Orbit save error
            if (orbitSaveErr) {
              return done(orbitSaveErr);
            }

            // Update Orbit name
            orbit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Orbit
            agent.put('/api/orbits/' + orbitSaveRes.body._id)
              .send(orbit)
              .expect(200)
              .end(function (orbitUpdateErr, orbitUpdateRes) {
                // Handle Orbit update error
                if (orbitUpdateErr) {
                  return done(orbitUpdateErr);
                }

                // Set assertions
                (orbitUpdateRes.body._id).should.equal(orbitSaveRes.body._id);
                (orbitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Orbits if not signed in', function (done) {
    // Create new Orbit model instance
    var orbitObj = new Orbit(orbit);

    // Save the orbit
    orbitObj.save(function () {
      // Request Orbits
      request(app).get('/api/orbits')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Orbit if not signed in', function (done) {
    // Create new Orbit model instance
    var orbitObj = new Orbit(orbit);

    // Save the Orbit
    orbitObj.save(function () {
      request(app).get('/api/orbits/' + orbitObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', orbit.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Orbit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/orbits/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Orbit is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Orbit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Orbit
    request(app).get('/api/orbits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Orbit with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Orbit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Orbit
        agent.post('/api/orbits')
          .send(orbit)
          .expect(200)
          .end(function (orbitSaveErr, orbitSaveRes) {
            // Handle Orbit save error
            if (orbitSaveErr) {
              return done(orbitSaveErr);
            }

            // Delete an existing Orbit
            agent.delete('/api/orbits/' + orbitSaveRes.body._id)
              .send(orbit)
              .expect(200)
              .end(function (orbitDeleteErr, orbitDeleteRes) {
                // Handle orbit error error
                if (orbitDeleteErr) {
                  return done(orbitDeleteErr);
                }

                // Set assertions
                (orbitDeleteRes.body._id).should.equal(orbitSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Orbit if not signed in', function (done) {
    // Set Orbit user
    orbit.user = user;

    // Create new Orbit model instance
    var orbitObj = new Orbit(orbit);

    // Save the Orbit
    orbitObj.save(function () {
      // Try deleting Orbit
      request(app).delete('/api/orbits/' + orbitObj._id)
        .expect(403)
        .end(function (orbitDeleteErr, orbitDeleteRes) {
          // Set message assertion
          (orbitDeleteRes.body.message).should.match('User is not authorized');

          // Handle Orbit error error
          done(orbitDeleteErr);
        });

    });
  });

  it('should be able to get a single Orbit that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Orbit
          agent.post('/api/orbits')
            .send(orbit)
            .expect(200)
            .end(function (orbitSaveErr, orbitSaveRes) {
              // Handle Orbit save error
              if (orbitSaveErr) {
                return done(orbitSaveErr);
              }

              // Set assertions on new Orbit
              (orbitSaveRes.body.name).should.equal(orbit.name);
              should.exist(orbitSaveRes.body.user);
              should.equal(orbitSaveRes.body.user._id, orphanId);

              // force the Orbit to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Orbit
                    agent.get('/api/orbits/' + orbitSaveRes.body._id)
                      .expect(200)
                      .end(function (orbitInfoErr, orbitInfoRes) {
                        // Handle Orbit error
                        if (orbitInfoErr) {
                          return done(orbitInfoErr);
                        }

                        // Set assertions
                        (orbitInfoRes.body._id).should.equal(orbitSaveRes.body._id);
                        (orbitInfoRes.body.name).should.equal(orbit.name);
                        should.equal(orbitInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Orbit.remove().exec(done);
    });
  });
});
