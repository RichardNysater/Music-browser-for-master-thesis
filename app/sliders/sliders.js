'use strict';

angular.module('myApp.sliders', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sliders', {
    templateUrl: 'sliders/sliders.html',
    controller: 'SlidersCtrl'
  });
}])

.controller('SlidersCtrl', ['$scope','Api','SongRequestService','angularPlayer','SlidersService',
      function ($scope, Api, SongRequestService,angularPlayer,SlidersService) {

          /**
           * Sends a request to play songs matching the features selected in the sliders
           */
          $scope.sendRequest = function(){
              SlidersService.saveSliders($scope.featurelist);
              SongRequestService.playMatchingSongs($scope.featurelist);
          };

          /**
           * Automatically sends a request to start playing if autoplay is enabled
           */
          $scope.autoRequest = function(){
              if($scope.autoplay){
                  $scope.sendRequest();
              }
          };

          /**
           * Toggles autoplay off or on
           */
          $scope.toggleAutoplay = function(){
              $scope.autoplay = !$scope.autoplay;
          };

          /**
           * Adds a percentage sign after the number on the slider
           */
          $scope.translate = function(value) {
              return value+'%';
          };

          /* Begin main body */

          $scope.featurelist = [];
          $scope.autoplay = true;

          /**
           * Build the featurelist with all features
           */
          if(!SlidersService.features) {
              Api.Features.query().$promise.then(function (data) {
                  for (var i = 0; i < data.length; i++) {
                      $scope.featurelist.push({"feature": data[i], "minvalue": 0, "maxvalue": 100});
                  }
              }, function (err) {
                  throw "No features were returned by query: " + err;
              });
          }
          else {
              $scope.featurelist = SlidersService.features;
          }
      }]);