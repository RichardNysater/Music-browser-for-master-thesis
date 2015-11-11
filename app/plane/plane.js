'use strict';

angular.module('myApp.plane', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plane', {
    templateUrl: 'plane/plane.html',
    controller: 'PlaneCtrl'
  });
}])

.controller('PlaneCtrl', ['$scope','Api','SongRequestService','PlaneService',
      function ($scope,Api,SongRequestService,PlaneService) {

        /**
         * planeClick is called whenever a user clicks on the 2d-plane
         * @param event Event
         */
          $scope.planeClick = function(event) {
            var CSS_plane =  $('.plane');
            $scope.imgwidth = CSS_plane.outerWidth()*($scope.FEATURE_VARIANCE/100);
            $scope.imgheight = CSS_plane.outerHeight()*($scope.FEATURE_VARIANCE/100);
            $scope.imgleft = event.pageX-($scope.imgwidth/2);
            $scope.imgtop = event.pageY-($scope.imgheight/2);

            // Save the current variables used for the click
            PlaneService.saveClick($scope.FEATURE_VARIANCE, $scope.firstSelect, $scope.secondSelect, $scope.imgleft,$scope.imgtop,$scope.imgwidth,$scope.imgheight);

            $scope.xc = event.offsetX;
            $scope.yc = event.offsetY;

            $scope.xpercent = Math.round(100*($scope.xc/CSS_plane.outerWidth()));
            $scope.ypercent = 100-Math.round(100*($scope.yc/(CSS_plane.outerHeight())));

            var xFeature = {feature:{id:$scope.firstSelect.id},minvalue:$scope.xpercent-$scope.FEATURE_VARIANCE,maxvalue:$scope.xpercent+$scope.FEATURE_VARIANCE};
            var yFeature = {feature:{id:$scope.secondSelect.id},minvalue:$scope.ypercent-$scope.FEATURE_VARIANCE,maxvalue:$scope.ypercent+$scope.FEATURE_VARIANCE};
            SongRequestService.playMatchingSongs([xFeature,yFeature]);

        };

        /**
         * If user has previously clicked somewhere, load the values for the previous click
         */
        var loadValues = function(labels){
          if(PlaneService.variance){
            $scope.FEATURE_VARIANCE = PlaneService.variance;
          }
          else{
            $scope.FEATURE_VARIANCE = 13; // Default variance
          }
          $scope.imgwidth = PlaneService.imgwidth;
          $scope.imgheight = PlaneService.imgheight;
          $scope.imgleft = PlaneService.imgleft;
          $scope.imgtop = PlaneService.imgtop;

          for(var i = 0; i<labels.length; i++){ // Existing labels should be selected in the select boxes
            if(PlaneService.firstSelect && labels[i].id == PlaneService.firstSelect.id){
              $scope.firstSelect = labels[i];
            }

            if(PlaneService.secondSelect && labels[i].id == PlaneService.secondSelect.id){
              $scope.secondSelect = labels[i];
            }
          }
        };


        /* Controller body starts here */

        //Get labels and load existing values
        Api.Features.query().$promise.then(function(data){
          $scope.labels = data;
          loadValues(data);

          if(!$scope.firstSelect){
            $scope.firstSelect = $scope.labels[0];
          }
          if(!$scope.secondSelect){
            $scope.secondSelect = $scope.labels[$scope.labels.length-1];
          }
        }, function(err){
          throw "No labels were returned by query: "+err;
        });



      }]);