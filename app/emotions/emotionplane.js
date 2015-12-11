'use strict';

/**
 * The Emotion plane controller handles the interactions within the emotion plane.
 * The emotion plane allows a user to click somewhere in a 2d-plane with four emotions in each corner,
 * the application will then create a playlist based on the distance to each emotion.
 */
angular.module('myApp.emotions', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/emotions', {
            templateUrl: 'emotions/emotions.html',
            controller: 'EmotionsCtrl'
        });
    }])

    .controller('EmotionsCtrl', ['$scope','Api','SongRequestService','EmotionService',
        function ($scope,Api,SongRequestService,EmotionService) {

            /**
             * Calculate the min-max values of each feature based on the distance between the click and the corners
             * @param x_coord The x-coordinate inside the plane.
             * @param y_coord The y-coordinate inside the plane.
             * @param plane_width The total width of the plane
             * @param plane_height The total height of the plane
             * @returns {Array} An array with each feature's min and max value calculated
             */
            var calcFeatures = function(x_coord, y_coord, plane_width, plane_height){
                var feature_list = [];

                /* Scale the coordinate system to be between -1 and 1 */
                var x =2*((x_coord/plane_width)-0.5);
                var y = 2*(0.5-(y_coord/plane_height));

                /* Interpolate the features based on the distance to each emotion
                   See http://www.speech.kth.se/prod/publications/files/1344.pdf for the algorithm used */
                for(var i = 0; i < $scope.emotions[0].features.length;i++){
                    var tr_max = $scope.topright.features[i].maxvalue;
                    var tl_max = $scope.topleft.features[i].maxvalue;
                    var bl_max = $scope.bottomleft.features[i].maxvalue;
                    var br_max = $scope.bottomright.features[i].maxvalue;

                    var tr_min = $scope.topright.features[i].minvalue;
                    var tl_min = $scope.topleft.features[i].minvalue;
                    var bl_min = $scope.bottomleft.features[i].minvalue;
                    var br_min = $scope.bottomright.features[i].minvalue;

                    var max_val = Math.round((0.25*y*(x*(tr_max - tl_max - br_max + bl_max) + tr_max + tl_max - br_max - bl_max))
                            + (0.25*((x*(tr_max - tl_max + br_max - bl_max)) + tr_max + tl_max + br_max + bl_max)));
                    max_val = Math.min($scope.feature_variance+max_val,100); // Limit max to 100

                    var min_val = Math.round(0.25*y*(x*(tr_min - tl_min - br_min + bl_min)
                            + tr_min + tl_min - br_min - bl_min) + 0.25*(x*(tr_min - tl_min + br_min - bl_min) + tr_min + tl_min + br_min + bl_min));
                    min_val = Math.max(min_val-$scope.feature_variance,0); // Limit min to 0

                    feature_list.push({"feature":{"id":$scope.emotions[0].features[i].feature}, "minvalue": min_val,"maxvalue": max_val});
                }
                return feature_list;
            };

            /**
             * If the user has previously clicked somewhere, load the values for the previous click
             */
            var loadValues = function(){
                $scope.imgwidth = EmotionService.imgwidth;
                $scope.imgheight = EmotionService.imgheight;
                $scope.imgleft = EmotionService.imgleft;
                $scope.imgtop = EmotionService.imgtop;
            };

            /**
             * planeClick is called whenever a user clicks on the 2d-plane
             * @param event Event
             */
            $scope.planeClick = function(event) {
                var CSS_plane = $('.plane');
                var plane_width = CSS_plane.outerWidth();
                var plane_height = CSS_plane.outerHeight();

                /* Calculate the location of the selection image */
                $scope.imgwidth = 10;
                $scope.imgheight = 10;

                $scope.imgleft = event.pageX-($scope.imgwidth/2);
                $scope.imgtop = event.pageY-($scope.imgheight/2);

                // Save the current variables used for the click
                EmotionService.saveClick($scope.imgleft,$scope.imgtop,$scope.imgwidth,$scope.imgheight);

                /* Calculate the features required to request for music */
                var feature_list = calcFeatures(event.offsetX,event.offsetY,plane_width,plane_height);
                SongRequestService.playMatchingSongs(feature_list);
                $scope.feature_list = feature_list;
            };

            /* Controller body starts here */

            $scope.feature_variance = 5;

            //Get labels, initialize select boxes and load existing values
            Api.Labels.emotions().$promise.then(function(data){
                $scope.emotions = data;
                loadValues(data);
                $scope.topleft = data[0];
                $scope.bottomright = data[1];
                $scope.topright = data[2];
                $scope.bottomleft = data[3];
            }, function(err){
                throw "No emotions were returned by query: "+err;
            });

        }]);