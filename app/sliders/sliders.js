'use strict';

angular.module('myApp.sliders', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/sliders', {
      templateUrl: 'sliders/sliders.html',
      controller: 'SlidersCtrl'
    });
  }])

  /**
   * The sliders controller handles the sliders for the /sliders page and allows users full control over the ranges
   * of the perceptual features.
   */
  .controller('SlidersCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'angularPlayer', 'SlidersService',
    function ($scope, ResourcesService, SongRequestService, angularPlayer, SlidersService) {

      /**
       * Sends a request to play songs matching the features selected in the sliders
       */
      $scope.sendRequest = function () {
        SlidersService.saveSliders($scope.featurelist);
        SongRequestService.playMatchingSongs($scope.featurelist);
      };

      /**
       * Adds a percentage sign after the number on the slider
       */
      $scope.translate = function (value) {
        return value + '%';
      };

      /**
       * Resets all the sliders to the original settings
       */
      $scope.resetSliders = function(){
        for(var i = 0; i < $scope.featurelist.length; i++){
          $scope.featurelist[i].minvalue = 0;
          $scope.featurelist[i].maxvalue = 100;
        }
      };

      /**
       * Loads existing values
       */
      var loadValues = function () {
        $scope.featurelist = SlidersService.getSavedValues().features;
      };

      /* Controller body starts here */

      $scope.featurelist = [];

      /**
       * Load the featurelist if possible, otherwise build it
       */
      if (!SlidersService.getSavedValues().features) {
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