'use strict';

describe('Orbits E2E Tests:', function () {
  describe('Test Orbits page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/orbits');
      expect(element.all(by.repeater('orbit in orbits')).count()).toEqual(0);
    });
  });
});
