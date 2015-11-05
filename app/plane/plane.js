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

        $scope.FEATURE_VARIANCE = 13;
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


            $scope.imgwidth = $('.plane').outerWidth()*($scope.FEATURE_VARIANCE/100);
            $scope.imgheight = $('.plane').outerHeight()*($scope.FEATURE_VARIANCE/100);
            $scope.imgleft = event.pageX-($scope.imgwidth/2);
            $scope.imgtop = event.pageY-($scope.imgheight/2);

            $scope.xc = event.offsetX;
            $scope.yc = event.offsetY;

            $scope.xpercent = Math.round(100*($scope.xc/$('.plane').outerWidth()));
            $scope.ypercent = 100-Math.round(100*($scope.yc/($('.plane').outerHeight())));

            var xFeature = {feature:{id:$scope.firstSelect.id},minvalue:$scope.xpercent-$scope.FEATURE_VARIANCE,maxvalue:$scope.xpercent+$scope.FEATURE_VARIANCE};
            var yFeature = {feature:{id:$scope.secondSelect.id},minvalue:$scope.ypercent-$scope.FEATURE_VARIANCE,maxvalue:$scope.ypercent+$scope.FEATURE_VARIANCE};
            SongRequestService.playMatchingSongs([xFeature,yFeature]);
        }


      }]);