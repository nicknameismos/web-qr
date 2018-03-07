'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Qrevent = mongoose.model('Qrevent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  qrevent;

/**
 * Qrevent routes tests
 */
describe('Qrevent CRUD tests', function () {

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

    // Save a user to the test db and create new Qrevent
    user.save(function () {
      qrevent = {
        name: 'Qrevent name'
      };

      done();
    });
  });

  it('should be able to save a Qrevent if logged in', function (done) {
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

        // Save a new Qrevent
        agent.post('/api/qrevents')
          .send(qrevent)
          .expect(200)
          .end(function (qreventSaveErr, qreventSaveRes) {
            // Handle Qrevent save error
            if (qreventSaveErr) {
              return done(qreventSaveErr);
            }

            // Get a list of Qrevents
            agent.get('/api/qrevents')
              .end(function (qreventsGetErr, qreventsGetRes) {
                // Handle Qrevents save error
                if (qreventsGetErr) {
                  return done(qreventsGetErr);
                }

                // Get Qrevents list
                var qrevents = qreventsGetRes.body;

                // Set assertions
                (qrevents[0].user._id).should.equal(userId);
                (qrevents[0].name).should.match('Qrevent name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Qrevent if not logged in', function (done) {
    agent.post('/api/qrevents')
      .send(qrevent)
      .expect(403)
      .end(function (qreventSaveErr, qreventSaveRes) {
        // Call the assertion callback
        done(qreventSaveErr);
      });
  });

  it('should not be able to save an Qrevent if no name is provided', function (done) {
    // Invalidate name field
    qrevent.name = '';

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

        // Save a new Qrevent
        agent.post('/api/qrevents')
          .send(qrevent)
          .expect(400)
          .end(function (qreventSaveErr, qreventSaveRes) {
            // Set message assertion
            (qreventSaveRes.body.message).should.match('Please fill Qrevent name');

            // Handle Qrevent save error
            done(qreventSaveErr);
          });
      });
  });

  it('should be able to update an Qrevent if signed in', function (done) {
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

        // Save a new Qrevent
        agent.post('/api/qrevents')
          .send(qrevent)
          .expect(200)
          .end(function (qreventSaveErr, qreventSaveRes) {
            // Handle Qrevent save error
            if (qreventSaveErr) {
              return done(qreventSaveErr);
            }

            // Update Qrevent name
            qrevent.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Qrevent
            agent.put('/api/qrevents/' + qreventSaveRes.body._id)
              .send(qrevent)
              .expect(200)
              .end(function (qreventUpdateErr, qreventUpdateRes) {
                // Handle Qrevent update error
                if (qreventUpdateErr) {
                  return done(qreventUpdateErr);
                }

                // Set assertions
                (qreventUpdateRes.body._id).should.equal(qreventSaveRes.body._id);
                (qreventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Qrevents if not signed in', function (done) {
    // Create new Qrevent model instance
    var qreventObj = new Qrevent(qrevent);

    // Save the qrevent
    qreventObj.save(function () {
      // Request Qrevents
      request(app).get('/api/qrevents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Qrevent if not signed in', function (done) {
    // Create new Qrevent model instance
    var qreventObj = new Qrevent(qrevent);

    // Save the Qrevent
    qreventObj.save(function () {
      request(app).get('/api/qrevents/' + qreventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', qrevent.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Qrevent with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/qrevents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Qrevent is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Qrevent which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Qrevent
    request(app).get('/api/qrevents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Qrevent with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Qrevent if signed in', function (done) {
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

        // Save a new Qrevent
        agent.post('/api/qrevents')
          .send(qrevent)
          .expect(200)
          .end(function (qreventSaveErr, qreventSaveRes) {
            // Handle Qrevent save error
            if (qreventSaveErr) {
              return done(qreventSaveErr);
            }

            // Delete an existing Qrevent
            agent.delete('/api/qrevents/' + qreventSaveRes.body._id)
              .send(qrevent)
              .expect(200)
              .end(function (qreventDeleteErr, qreventDeleteRes) {
                // Handle qrevent error error
                if (qreventDeleteErr) {
                  return done(qreventDeleteErr);
                }

                // Set assertions
                (qreventDeleteRes.body._id).should.equal(qreventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Qrevent if not signed in', function (done) {
    // Set Qrevent user
    qrevent.user = user;

    // Create new Qrevent model instance
    var qreventObj = new Qrevent(qrevent);

    // Save the Qrevent
    qreventObj.save(function () {
      // Try deleting Qrevent
      request(app).delete('/api/qrevents/' + qreventObj._id)
        .expect(403)
        .end(function (qreventDeleteErr, qreventDeleteRes) {
          // Set message assertion
          (qreventDeleteRes.body.message).should.match('User is not authorized');

          // Handle Qrevent error error
          done(qreventDeleteErr);
        });

    });
  });

  it('should be able to get a single Qrevent that has an orphaned user reference', function (done) {
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

          // Save a new Qrevent
          agent.post('/api/qrevents')
            .send(qrevent)
            .expect(200)
            .end(function (qreventSaveErr, qreventSaveRes) {
              // Handle Qrevent save error
              if (qreventSaveErr) {
                return done(qreventSaveErr);
              }

              // Set assertions on new Qrevent
              (qreventSaveRes.body.name).should.equal(qrevent.name);
              should.exist(qreventSaveRes.body.user);
              should.equal(qreventSaveRes.body.user._id, orphanId);

              // force the Qrevent to have an orphaned user reference
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

                    // Get the Qrevent
                    agent.get('/api/qrevents/' + qreventSaveRes.body._id)
                      .expect(200)
                      .end(function (qreventInfoErr, qreventInfoRes) {
                        // Handle Qrevent error
                        if (qreventInfoErr) {
                          return done(qreventInfoErr);
                        }

                        // Set assertions
                        (qreventInfoRes.body._id).should.equal(qreventSaveRes.body._id);
                        (qreventInfoRes.body.name).should.equal(qrevent.name);
                        should.equal(qreventInfoRes.body.user, undefined);

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
      Qrevent.remove().exec(done);
    });
  });
});
