var SlidersService = angular.module('SlidersService', []);

/**
 * Serves as storage for values selected from the sliders.
 */
SlidersService.factory('SlidersService', function () {
  var SlidersService = {};

  /**
   * Should be called to save values selected in the sliders
   * @param features The features to save
   */
  SlidersService.saveSliders = function (features, autoplay) {
    SlidersService.features = features;
    SlidersService.autoplay = autoplay;
  };

  return SlidersService;
});