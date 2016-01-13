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
  .controller('PlayerController', ['$scope','SongRequestService','PlayerService',
    function ($scope,SongRequestService,PlayerService) {
      $scope.is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; // Identify if user is using chrome.
      $scope.autoplay = PlayerService.getAutoPlay();
      console.log($scope.autoplay);

      /**
       * Toggles whether songs should be autoplayed or not
       */
      $scope.toggleAutoPlay = function(){
        $scope.autoplay = !$scope.autoplay;
        PlayerService.saveAutoPlay($scope.autoplay);
      };

      /**
       * Sets the volume of songs
       * @param volume The volume to set songs to (0-100)
       */
      $scope.setVolume = function(volume){
        SongRequestService.setVolume(volume);
        PlayerService.saveVolume(volume);
      };

      /* Controller body starts here */
      var volumeSlider = $("#volume-slider");
      volumeSlider.slider({ min: 0, max: 100, value: PlayerService.getVolume() });
      volumeSlider.on("slide", function(slideEvt) {
        $scope.setVolume(slideEvt.value);
      });


    }]);