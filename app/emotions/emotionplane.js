'use strict';

angular.module('myApp.emotions', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/emotions', {
            templateUrl: 'emotions/emotions.html',
            controller: 'EmotionsCtrl'
        });
    }])

    .controller('EmotionsCtrl', ['$scope','Api',
        function ($scope,Api) {

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
             * planeClick is called whenever a user clicks on the 2d-plane
             * @param event Event
             */
            $scope.planeClick = function(event) {
                $scope.xc = event.offsetX;
                $scope.yc = event.offsetY;

                $scope.imgwidth = 10;
                $scope.imgheight = 10;

                $scope.imgleft = event.pageX-($scope.imgwidth/2);
                $scope.imgtop = event.pageY-($scope.imgheight/2);
                $scope.xpercent = Math.round(100*($scope.xc/$('.plane').outerWidth()));
                $scope.ypercent = Math.round(100*($scope.yc/($('.plane').outerHeight())));

                $scope.topleftpercent = ((100-$scope.xpercent)+(100-$scope.ypercent))/2;
                $scope.toprightpercent = (($scope.xpercent)+(100-$scope.ypercent))/2;
                $scope.bottomleftpercent = ((100-$scope.xpercent)+($scope.ypercent))/2;
                $scope.bottomrightpercent = (($scope.xpercent)+($scope.ypercent))/2;
            }


        }]);