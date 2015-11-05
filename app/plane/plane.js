'use strict';

angular.module('myApp.plane', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plane', {
    templateUrl: 'plane/plane.html',
    controller: 'PlaneCtrl'
  });
}])

.controller('PlaneCtrl', ['$scope','Api','SongRequestService',
      function ($scope,Api,SongRequestService) {

        //Get labels and initialize select boxes
        Api.Features.query().$promise.then(function(data){
          $scope.labels = data;
          $scope.firstSelect = data[0];
          $scope.secondSelect = data[data.length-1];
        }, function(err){
          throw "No labels were returned by query: "+err;
        });

        /**
         * planeClick is called whenever a user clicks on the 2d-plane
         * @param event Event
         */
          $scope.planeClick = function(event) {
            var FEATURE_VARIANCE = 10;

            $scope.xc = event.offsetX;
            $scope.yc = event.offsetY;


            $scope.imgwidth = $('.plane').outerWidth()*(FEATURE_VARIANCE/100);
            $scope.imgheight = $('.plane').outerHeight()*(FEATURE_VARIANCE/100);
            $scope.imgleft = event.pageX-($scope.imgwidth/2);
            $scope.imgtop = event.pageY-($scope.imgheight/2);
            $scope.xpercent = Math.round(100*($scope.xc/$('.plane').outerWidth()));
            $scope.ypercent = Math.round(100*($scope.yc/($('.plane').outerHeight())));


            var xFeature = {feature:{id:$scope.firstSelect.id},minvalue:$scope.xpercent-FEATURE_VARIANCE,maxvalue:$scope.xpercent+FEATURE_VARIANCE};
            var yFeature = {feature:{id:$scope.secondSelect.id},minvalue:$scope.ypercent-FEATURE_VARIANCE,maxvalue:$scope.ypercent+FEATURE_VARIANCE};
            SongRequestService.playMatchingSongs([xFeature,yFeature]);
        }


      }]);