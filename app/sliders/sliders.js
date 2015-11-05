'use strict';

angular.module('myApp.sliders', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sliders', {
    templateUrl: 'sliders/sliders.html',
    controller: 'SlidersCtrl'
  });
}])

.controller('SlidersCtrl', ['$scope','Api','SongRequestService','angularPlayer',
      function ($scope, Api, SongRequestService,angularPlayer) {
          $scope.featurelist = [];

          /**
           * Build the featurelist with all features
           */
          Api.Features.query().$promise.then(function(data){
             for(var i = 0; i<data.length; i++){
                 $scope.featurelist.push({"feature":data[i], "minvalue":0,"maxvalue":100});
              }
          }, function(err){
              throw "No features were returned by query: "+err;
          });

          $scope.sendRequest = function(){
              /*
              var req = SongRequestService.sendRequest($scope.featurelist);
              req.then(function successCallback(response) {
                  console.log(response.body);
              }, function errorCallback(response) {
                  console.log("fail");
              });*/
              SongRequestService.playMatchingSongs($scope.featurelist);
          }

          /**
           * Adds a percentage sign after the number on the slider
           */
          $scope.translate = function(value) {
              return value+'%';
          };
      }]);