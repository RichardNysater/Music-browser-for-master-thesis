var EmotionService = angular.module('EmotionService',[]);

/**
 * Serves as storage for values selected in the emotion plane.
 */
EmotionService.factory('EmotionService', function() {
    var emotionService = {};

    /**
     * Should be called to save values for a click in the 2d-plane.
     * @param left The css-value for where the image should be displayed
     * @param top The css-value for where the image should be displayed
     * @param width The width of the image
     * @param height The height of the image
     */
    emotionService.saveClick = function (left, top, width, height) {
        emotionService.imgleft = left;
        emotionService.imgtop = top;
        emotionService.imgwidth = width;
        emotionService.imgheight = height;
    };

    return emotionService;
});