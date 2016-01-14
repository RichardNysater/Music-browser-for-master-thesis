var SlidersService = angular.module('SlidersService', []);

/**
 * Serves as storage for values selected from the sliders.
 */
SlidersService.service('SlidersService', function () {
  var savedValues = {};
  var lastRequest;

  /**
   * Sets which request number was last sent
   * @param requestNumber The number of the last request sent
   */
  this.setLastRequest = function(requestNumber){
    lastRequest = requestNumber;
  };

  /**
   * Gets the number of the last request sent
   * @returns {*} An integer showing which request was last sent by the controller
   */
  this.getLastRequest = function(){
    return lastRequest;
  };

  /**
   * Should be called to save values selected in the sliders
   * @param features The features to save
   */
  this.saveSliders = function (features) {
    savedValues.features = features;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function(){
    return savedValues;
  };

});