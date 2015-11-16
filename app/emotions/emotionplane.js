'use strict';

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
                $scope.topleft = data[0].firstEmotion.emotion;
                $scope.bottomright = data[0].secondEmotion.emotion;

                $scope.topright = data[1].firstEmotion.emotion;
                $scope.bottomleft = data[1].secondEmotion.emotion;

            }, function(err){
                throw "No labels were returned by query: "+err;
            });


            /**
             * Calculate how important each emotion is to a coordinate.
             * @param xcoord The x-coordinate inside the plane.
             * @param ycoord The y-coordinate inside the plane.
             * @param plane_width The total width of the plane
             * @param plane_height The total height of the plane
             * @returns {{TL: number, TR: number, BL: number, BR: number}} The importance of each of the emotions
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
                TL = (TL*(1/sum))/0.25;
                TR = (TR*(1/sum))/0.25;
                BL = (BL*(1/sum))/0.25;
                BR = (BR*(1/sum))/0.25;

                TL = TL.toFixed(2);
                TR = TR.toFixed(2);
                BL = BL.toFixed(2);
                BR = BR.toFixed(2);

                return {TL,TR,BL,BR};
            };

            /**
             * Calculate the min-max values of each feature based on the importance of each emotion.
             * @param emotion_importance The importance of the four emotions
             */
            var calcFeatures = function(emotion_importance){
                //TODO: Implement the calculation
            };

            /**
             * planeClick is called whenever a user clicks on the 2d-plane
             * @param event Event
             */
            $scope.planeClick = function(event) {
                var CSS_plane = $('.plane');
                var plane_width = CSS_plane.outerWidth();
                var plane_height = CSS_plane.outerHeight();

                $scope.imgwidth = 10;
                $scope.imgheight = 10;

                $scope.imgleft = event.pageX-($scope.imgwidth/2);
                $scope.imgtop = event.pageY-($scope.imgheight/2);

                var emotion_importance = calcImportance(event.offsetX,event.offsetY,plane_width,plane_height);
                var feature_list = calcFeatures(emotion_importance);
                //SongRequestService.playMatchingSongs(feature_list);
            }


        }]);