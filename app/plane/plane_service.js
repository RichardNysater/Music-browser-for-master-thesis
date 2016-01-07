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
   * @param width The width of the image
   * @param height The height of the image
   * @param selection_percent The x-position of the selection marker in percent
   */
  this.saveClick = function (variance, firstSelect, secondSelect, left, top, width, height, selection_percent, xpercent, ypercent) {
    savedValues.variance = variance;
    savedValues.firstSelect = firstSelect;
    savedValues.secondSelect = secondSelect;
    savedValues.imgleft = left;
    savedValues.imgtop = top;
    savedValues.imgwidth = width;
    savedValues.imgheight = height;
    savedValues.selection_percent = selection_percent;
    savedValues.xpercent = xpercent;
    savedValues.ypercent = ypercent;
  };

  /**
   * Should be called whenever window size is changed.
   * @param left The css-value for where the image should be displayed
   * @param selection_percent The x-position of the selection marker in percent
   */
  this.saveUpdatedWindow = function(left, selection_percent){
    savedValues.imgleft = left;
    savedValues.selection_percent = selection_percent;
  };

  /**
   * Returns the saved values in this service
   * @returns {{}} An object with the saved values
   */
  this.getSavedValues = function(){
    return savedValues;
  };

});