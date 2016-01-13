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
  .controller('SlidersCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'angularPlayer', 'SlidersService','$timeout',
    function ($scope, ResourcesService, SongRequestService, angularPlayer, SlidersService, $timeout) {
      const ERROR_DURATION = 3000;
      var activeErrors = 0;

      /**
       * Shows the "No songs found"-error
       * @param duration The duration to show the error for
       */
      var showNoSongsFoundError = function (duration) {
        $scope.showError = true;
        activeErrors++;
        var thisError = activeErrors;
        $timeout(function () {
          if (thisError === activeErrors) { // No new errors have been added during the timeout
            $scope.showError = false;
            activeErrors = 0;
          }
        }, duration);
      };

      /**
       * Callback function which gets called when songs are to be added
       * @param res The added songs
       */
      var addedSongs = function (res) {
        if (res.length === 0) {
          showNoSongsFoundError(ERROR_DURATION);
        }
      };

      /**
       * Sets the location of the error
       * @param sliderId The id of the slider used
       */
      var setErrorLocation = function(sliderId){
        var sliderOffset = $('.'+sliderId).offset();
        $scope.errorLeft = sliderOffset.left;
        $scope.errorTop = sliderOffset.top+35;

      };

      /**
       * Sends a request to play songs matching the features selected in the sliders
       */
      $scope.sendRequestForClosest = function (sliderId) {
        setErrorLocation(sliderId);
        SlidersService.saveSliders($scope.featurelist);
        SongRequestService.playMatchingSongs($scope.featurelist,addedSongs,"Closest");
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