'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Qrevent = mongoose.model('Qrevent');

/**
 * Globals
 */
var user,
  qrevent;

/**
 * Unit tests
 */
describe('Qrevent Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      qrevent = new Qrevent({
        rank: 1,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return qrevent.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Qrevent.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
