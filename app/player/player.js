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
      $scope.is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; // Identify if user is using chrome.
      $scope.autoplay = SongRequestService.getAutoPlay();

      /**
       * Toggles whether songs should be autoplayed or not
       */
      $scope.toggleAutoPlay = function(){
        $scope.autoplay = !$scope.autoplay;
        SongRequestService.setAutoPlay($scope.autoplay);
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