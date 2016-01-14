var EmotionsService = angular.module('EmotionsService', []);

/**
 * Serves as storage for values selected in the emotion plane.
 */
EmotionsService.service('EmotionsService', function () {
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
   * Should be called to save values for a click in the 2d-plane.
   * @param left The css-value for where the image should be displayed
   * @param top The css-value for where the image should be displayed
   * @param width The width of the image
   * @param height The height of the image
   * @param featureList The list of features to save
   * @param selectionImgXPercent The x-position of the selection marker in percent
   * @param selectionImgYPercent The y-position of the selection marker in percent
   */
  this.saveClick = function (left, top, width, height, featureList, selectionImgXPercent, selectionImgYPercent) {
    savedValues.imgLeft = left;
    savedValues.imgTop = top;
    savedValues.imgWidth = width;
    savedValues.imgHeight = height;
    savedValues.featureList = featureList;
    savedValues.selectionImgXPercent = selectionImgXPercent;
    savedValues.selectionImgYPercent = selectionImgYPercent;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function(){
    return savedValues;
  };

});