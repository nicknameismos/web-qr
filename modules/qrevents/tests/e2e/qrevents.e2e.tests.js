'use strict';

describe('Qrevents E2E Tests:', function () {
  describe('Test Qrevents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/qrevents');
      expect(element.all(by.repeater('qrevent in qrevents')).count()).toEqual(0);
    });
  });
});
