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
            $scope.imgwidth = CSS_plane.outerWidth()*($scope.feature_variance/100);
            $scope.imgheight = CSS_plane.outerHeight()*($scope.feature_variance/100);
            $scope.imgleft = event.pageX-($scope.imgwidth/2);
            $scope.imgtop = event.pageY-($scope.imgheight/2);

            // Save the current variables used for the click
            PlaneService.saveClick($scope.feature_variance, $scope.firstSelect, $scope.secondSelect, $scope.imgleft,$scope.imgtop,$scope.imgwidth,$scope.imgheight);

            $scope.xc = event.offsetX;
            $scope.yc = event.offsetY;

            $scope.xpercent = Math.round(100*($scope.xc/CSS_plane.outerWidth()));
            $scope.ypercent = 100-Math.round(100*($scope.yc/(CSS_plane.outerHeight())));

            // Create the min and max values for the two features based on the variance and where the user clicked
            var xFeature = {feature:{id:$scope.firstSelect.id},minvalue:$scope.xpercent-$scope.feature_variance,maxvalue:$scope.xpercent+$scope.feature_variance};
            var yFeature = {feature:{id:$scope.secondSelect.id},minvalue:$scope.ypercent-$scope.feature_variance,maxvalue:$scope.ypercent+$scope.feature_variance};
            SongRequestService.playMatchingSongs([xFeature,yFeature]);

        };

        /**
         * If the user has previously clicked somewhere, load the values for the previous click
         * @param features The features available.
         */
        var loadValues = function(features){
          if(PlaneService.variance){
            $scope.feature_variance = PlaneService.variance;
          }
          else{
            $scope.feature_variance = 13; // Default variance
          }
          $scope.imgwidth = PlaneService.imgwidth;
          $scope.imgheight = PlaneService.imgheight;
          $scope.imgleft = PlaneService.imgleft;
          $scope.imgtop = PlaneService.imgtop;

          for(var i = 0; i<features.length; i++){ // Existing features should be selected in the select boxes
            if(PlaneService.firstSelect && features[i].id == PlaneService.firstSelect.id){
              $scope.firstSelect = features[i];
            }

            if(PlaneService.secondSelect && features[i].id == PlaneService.secondSelect.id){
              $scope.secondSelect = features[i];
            }
          }
        };


        /* Controller body starts here */

        //Get features and load existing values
        Api.Features.query().$promise.then(function(data){
          $scope.features = data;
          loadValues(data);

          if(!$scope.firstSelect){
            $scope.firstSelect = $scope.features[0];
          }
          if(!$scope.secondSelect){
            $scope.secondSelect = $scope.features[$scope.features.length-1];
          }
        }, function(err){
          throw "No features were returned by query: "+err;
        });



      }]);