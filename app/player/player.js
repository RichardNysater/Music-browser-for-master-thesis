'use strict';

angular.module('myApp.player', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/player', {
      templateUrl: 'player/player.html',
      controller: 'PlayerController'
    });
  }])

  /**
   * The PlayerController handles the music player at the bottom of the website.
   */
  .controller('PlayerController', ['$scope','SongRequestService',
    function ($scope,SongRequestService) {

      /**
       * Toggles whether songs should be autoplayed or not
       */
      $scope.toggleAutoPlay = function(){
        SongRequestService.setAutoPlay(!SongRequestService.getAutoPlay());
      };

      /**
       * Sets the volume of songs
       * @param volume The volume to set songs to (0-100)
       */
      $scope.setVolume = function(volume){
        SongRequestService.setVolume(volume);
      };

      var volumeSlider = $("#volumeSlider");
      volumeSlider.slider();
      volumeSlider.on("slide", function(slideEvt) {
        $scope.setVolume(slideEvt.value);
      });

    }]);