var SlidersService = angular.module('SlidersService', []);

/**
 * Serves as storage for values selected from the sliders.
 */
SlidersService.service('SlidersService', function () {
  var savedValues = {playTimes:0};
  var transferredValues = [];
  var lastRequestNumber;

  /**
   * Sets which request number was last sent
   * @param requestNumber The number of the last request sent
   */
  this.setLastRequestNumber = function (requestNumber) {
    lastRequestNumber = requestNumber;
  };

  /**
   * Gets the number of the last request sent
   * @returns {*} An integer showing which request was last sent by the controller
   */
  this.getLastRequestNumber = function () {
    return lastRequestNumber;
  };

  /**
   * Should be called to save values selected in the sliders
   * @param features The features to save
   */
  this.saveSliders = function (features) {
    savedValues.features = features;
    savedValues.playTimes += 1;
  };

  /**
   * Returns whether or not features have been transferred over
   */
  this.hasTransferred = function () {
    return transferredValues.length > 0;
  };

  /**
   * Transfer features over to the sliders.
   * @param featureList The features to transfer
   * @param requestNumber The number of the request of the transferred features
   */
  this.transferFeatures = function (featureList, requestNumber) {
    transferredValues = featureList;
    lastRequestNumber = requestNumber;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function () {
    return savedValues;
  };


  /**
   * Returns the transferred values
   * @returns {Array} An array with the transferred values
   */
  this.getTransferredValues = function () {
    return transferredValues;
  };

  /**
   * Clears the transferred values
   */
  this.clearTransferredValues = function () {
    transferredValues = [];
  };

});