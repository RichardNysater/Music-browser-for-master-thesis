'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function () {


  it('should automatically redirect to /player when location hash/fragment is empty', function () {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/player");
  });


  describe('player', function () {

    beforeEach(function () {
      browser.get('index.html#/player');
    });


    it('should render player when user navigates to /player', function () {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
      toMatch(/partial for view 1/);
    });

  });


  describe('plane', function () {

    beforeEach(function () {
      browser.get('index.html#/plane');
    });


    it('should render plane when user navigates to /plane', function () {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
      toMatch(/partial for view 2/);
    });

  });
});
