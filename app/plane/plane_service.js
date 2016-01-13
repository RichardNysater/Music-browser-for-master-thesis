var PlaneService = angular.module('PlaneService', []);

/**
 * Serves as storage for values selected in the plane.
 */
PlaneService.service('PlaneService', function () {
  var savedValues = {};

  /**
   * Should be called to save values for a click in the 2d-plane.
   * @param variance The variance
   * @param firstSelect The feature selected as x-axis
   * @param secondSelect The feature selected as y-axis
   * @param left The css-value for where the image should be displayed
   * @param top The css-value for where the image should be displayed
   * @param selectionImgXPercent The x-position of the selection marker in percent
   * @param selectionImgYPercent The y-position of the selection marker in percent
   * @param width The width of the image
   * @param height The height of the image
   * @param xPercent Where in the x-axis the user clicked in percent
   * @param yPercent Where in the y-axis the user clicked in percent
   */
  this.saveClick = function (variance, firstSelect, secondSelect, left, top, width, height, selectionImgXPercent, selectionImgYPercent,xPercent, yPercent) {
    savedValues.variance = variance;
    savedValues.firstSelect = firstSelect;
    savedValues.secondSelect = secondSelect;
    savedValues.imgLeft = left;
    savedValues.imgTop = top;
    savedValues.imgWidth = width;
    savedValues.imgHeight = height;
    savedValues.selectionImgXPercent = selectionImgXPercent;
    savedValues.selectionImgYPercent = selectionImgYPercent;
    savedValues.xPercent = xPercent;
    savedValues.yPercent = yPercent;
  };

  /**
   * Should be called whenever window size is changed.
   * @param left The css-value for where the image should be displayed
   * @param width The width of the selection image
   * @param height The height of the selection image
   * @param selectionImgXPercent The x-position of the selection marker in percent
   * @param selectionImgYPercent The y-position of the selection marker in percent
   */
  this.saveUpdatedWindow = function(left, width, height, selectionImgXPercent, selectionImgYPercent){
    savedValues.imgLeft = left;
    savedValues.selectionImgXPercent = selectionImgXPercent;
    savedValues.selectionImgYPercent = selectionImgYPercent;
    savedValues.imgWidth = width;
    savedValues.imgHeight = height;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function(){
    return savedValues;
  };

});