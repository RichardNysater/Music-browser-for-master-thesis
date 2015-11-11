var PlaneService = angular.module('PlaneService',[]);

/**
 * Serves as storage for values selected in the plane.
 */
PlaneService.factory('PlaneService', function() {
    var planeService = {};

    /**
     * Should be called to save values for a click in the 2d-plane.
     * @param variance The variance
     * @param firstSelect The feature selected as x-axis
     * @param secondSelect The feature selected as y-axis
     * @param left The css-value for where the image should be displayed
     * @param top The css-value for where the image should be displayed
     * @param width The width of the image
     * @param height The height of the image
     */
    planeService.saveClick = function (variance, firstSelect, secondSelect, left, top, width, height) {
        planeService.variance = variance;
        planeService.firstSelect = firstSelect;
        planeService.secondSelect = secondSelect;
        planeService.imgleft = left;
        planeService.imgtop = top;
        planeService.imgwidth = width;
        planeService.imgheight = height;
    };

    return planeService;
});