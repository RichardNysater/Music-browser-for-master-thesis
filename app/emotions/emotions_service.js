var EmotionsService = angular.module('EmotionsService',[]);

/**
 * Serves as storage for values selected in the emotion plane.
 */
EmotionsService.factory('EmotionsService', function() {
    var emotionsService = {};

    /**
     * Should be called to save values for a click in the 2d-plane.
     * @param left The css-value for where the image should be displayed
     * @param top The css-value for where the image should be displayed
     * @param width The width of the image
     * @param height The height of the image
     * @param feature_list The list of features to save
     */
    emotionsService.saveClick = function (left, top, width, height, feature_list) {
        emotionsService.imgleft = left;
        emotionsService.imgtop = top;
        emotionsService.imgwidth = width;
        emotionsService.imgheight = height;
        emotionsService.feature_list = feature_list;
    };

    return emotionsService;
});