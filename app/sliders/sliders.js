'use strict';

angular.module('myApp.sliders', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sliders', {
    templateUrl: 'sliders/sliders.html',
    controller: 'SlidersCtrl'
  });
}])

.controller('SlidersCtrl', ['$scope','Api',
      function ($scope, Api) {
          $scope.featurelist = [];

          Api.Features.query().$promise.then(function(data){

             for(var i = 0; i<data.length; i++){
                 $scope.featurelist.push({"feature":data[i], "minvalue":0,"maxvalue":100});
              }
          }, function(err){
              throw "No labels were returned by query.";
          });

      }]);