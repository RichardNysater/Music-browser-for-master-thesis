var EmotionsService = angular.module('EmotionsService', []);

/**
 * Serves as storage for values selected in the emotion plane.
 */
EmotionsService.service('EmotionsService', function () {
  var savedValues = {};

  /**
   * Should be called to save values for a click in the 2d-plane.
   * @param left The css-value for where the image should be displayed
   * @param top The css-value for where the image should be displayed
   * @param width The width of the image
   * @param height The height of the image
   * @param feature_list The list of features to save
   * @param selection_percent The x-position of the selection marker in percent
   */
  this.saveClick = function (left, top, width, height, feature_list, selection_percent) {
    savedValues.imgleft = left;
    savedValues.imgtop = top;
    savedValues.imgwidth = width;
    savedValues.imgheight = height;
    savedValues.feature_list = feature_list;
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