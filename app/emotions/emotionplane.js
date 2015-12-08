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

    .controller('EmotionsCtrl', ['$scope','Api','SongRequestService',
        function ($scope,Api,SongRequestService) {

            //Get labels and initialize select boxes
            Api.Labels.emotions().$promise.then(function(data){
                $scope.emotions = data;

                $scope.topleft = data[0].emotion;
                $scope.bottomright = data[1].emotion;

                $scope.topright = data[2].emotion;
                $scope.bottomleft = data[3].emotion;
                $scope.emotionnames = [$scope.topleft, $scope.topright, $scope.bottomleft, $scope.bottomright];
            }, function(err){
                throw "No emotions were returned by query: "+err;
            });

            /**
             * Calculate how important each emotion is to a coordinate.
             * @param xcoord The x-coordinate inside the plane.
             * @param ycoord The y-coordinate inside the plane.
             * @param plane_width The total width of the plane
             * @param plane_height The total height of the plane
             * @returns {{}} A mapping between the emotions and their importance
             */
            var calcImportance = function(xcoord, ycoord, plane_width, plane_height){

                /* Calculate the distances */
                var distanceTL = Math.sqrt(Math.pow(xcoord - 0, 2) + Math.pow(ycoord - 0, 2)); // Distance to top left corner
                var distanceTR = Math.sqrt(Math.pow(xcoord - plane_width, 2) + Math.pow(ycoord - 0, 2)); // Distance to top right corner
                var distanceBL = Math.sqrt(Math.pow(xcoord - 0, 2) + Math.pow(ycoord - plane_height, 2)); // Distance to bottom left corner
                var distanceBR = Math.sqrt(Math.pow(xcoord - plane_width, 2) + Math.pow(ycoord - plane_height, 2)); // Distance to bottom right corner

                /* Calculate  how close to a corner the position is from 1 to 0 */
                var max_nearby_distance = (plane_height+plane_width)/2;
                var TL = 1-Math.min(1,distanceTL/(max_nearby_distance));
                var TR = 1-Math.min(1,distanceTR/(max_nearby_distance));
                var BL = 1-Math.min(1,distanceBL/(max_nearby_distance));
                var BR = 1-Math.min(1,distanceBR/(max_nearby_distance));

                /* Calculate the importance of each corner */
                var sum = TL+TR+BL+BR;
                TL = TL*4/sum;
                TR = TR*4/sum;
                BL = BL*4/sum;
                BR = BR*4/sum;

                TL = TL.toFixed(2);
                TR = TR.toFixed(2);
                BL = BL.toFixed(2);
                BR = BR.toFixed(2);

                var map = {};
                map[$scope.topleft] = TL;
                map[$scope.topright] = TR;
                map[$scope.bottomleft] = BL;
                map[$scope.bottomright] = BR;
                return map;
            };

            /**
             * Calculate the min-max values of each feature based on the importance of each emotion.
             * @param emotion_importance The importance of the four emotions
             */
            var calcFeatures = function(emotion_importance){
                var feature_list = [];

                for(var i = 0; i < $scope.emotions[0].features.length;i++){
                    var maxValSum = 0, minValSum = 0;

                    /* Each emotion should have a set of features with a min-value and max-value.
                    *  For each feature we sum the max values and min values from all the emotions weighed by their importance. */
                    for(var j = 0; j < 4; j++){
                        maxValSum += $scope.emotions[j].features[i].maxvalue * emotion_importance[$scope.emotions[j].emotion];
                        minValSum += $scope.emotions[j].features[i].minvalue * emotion_importance[$scope.emotions[j].emotion];
                    }
                    var maxVal = maxValSum/4;
                    var minVal = minValSum/4;
                    feature_list.push({"feature":{"id":$scope.emotions[0].features[i].feature}, "minvalue":minVal,"maxvalue":maxVal});
                }
                return feature_list;
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

                /* Calculate the importance and features required to request for music */
                var emotion_importance = calcImportance(event.offsetX,event.offsetY,plane_width,plane_height);
                var feature_list = calcFeatures(emotion_importance);
                SongRequestService.playMatchingSongs(feature_list);
            }


        }]);