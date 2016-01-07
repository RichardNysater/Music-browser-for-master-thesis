'use strict';

angular.module('myApp.sliders', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/sliders', {
      templateUrl: 'sliders/sliders.html',
      controller: 'SlidersCtrl'
    });
  }])

  .controller('SlidersCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'angularPlayer', 'SlidersService',
    function ($scope, ResourcesService, SongRequestService, angularPlayer, SlidersService) {

      /**
       * Sends a request to play songs matching the features selected in the sliders
       */
      $scope.sendRequest = function () {
        SlidersService.saveSliders($scope.featurelist, $scope.autoplay);
        SongRequestService.playMatchingSongs($scope.featurelist);
      };

      /**
       * Automatically sends a request to start playing if autoplay is enabled
       */
      $scope.autoRequest = function () {
        if ($scope.autoplay) {
          $scope.sendRequest();
        }
      };

      /**
       * Toggles autoplay off or on
       */
      $scope.toggleAutoplay = function () {
        $scope.autoplay = !$scope.autoplay;
        SlidersService.saveSliders($scope.featurelist, $scope.autoplay);
      };

      /**
       * Adds a percentage sign after the number on the slider
       */
      $scope.translate = function (value) {
        return value + '%';
      };

      /**
       * Loads existing values
       */
      var loadValues = function () {
        $scope.autoplay = SlidersService.getSavedValues().autoplay;
        $scope.featurelist = SlidersService.getSavedValues().features;
      }

      /* Controller body starts here */

      $scope.featurelist = [];

      /**
       * Load the featurelist if possible, otherwise build it
       */
      if (!SlidersService.getSavedValues().features) {
        $scope.autoplay = true;
        ResourcesService.Features.query().$promise.then(function (data) {
          for (var i = 0; i < data.length; i++) {
            $scope.featurelist.push({"feature": data[i], "minvalue": 0, "maxvalue": 100});
          }
        }, function (err) {
          throw "No features were returned by query: " + err;
        });
      }
      else {
        loadValues();
      }

    }]);