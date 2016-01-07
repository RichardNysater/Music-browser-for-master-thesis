var SlidersService = angular.module('SlidersService', []);

/**
 * Serves as storage for values selected from the sliders.
 */
SlidersService.service('SlidersService', function () {
  var savedValues = {};

  /**
   * Should be called to save values selected in the sliders
   * @param features The features to save
   */
  this.saveSliders = function (features, autoplay) {
    savedValues.features = features;
    savedValues.autoplay = autoplay;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function(){
    return savedValues;
  };

});