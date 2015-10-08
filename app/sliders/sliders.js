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
          $scope.features = Api.Features.query();

      }])

.directive('rangeslider', function() {
        return function(scope, element, attrs) {


            if (scope.$last) {
                $(".rangeslider").slider({tooltip:'always'});
            }
        };
    });