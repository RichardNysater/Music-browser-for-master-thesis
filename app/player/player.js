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
  .controller('PlayerController', ['$scope','SongRequestService','PlayerService','angularPlayer',
    function ($scope,SongRequestService,PlayerService, angularPlayer) {

      /**
       * Toggles whether songs should be autoplayed or not
       */
      $scope.toggleAutoPlay = function(){
        $scope.autoPlay = !$scope.autoPlay;
        PlayerService.saveAutoPlay($scope.autoPlay);
      };

      /**
       * Sets the volume of songs
       * @param volume The volume to set songs to (0-100)
       */
      $scope.setVolume = function(volume){
        $scope.volume = volume;
        SongRequestService.setVolume(volume);
        PlayerService.saveVolume(volume);
      };

      /**
       * Starts playing the next track in the playlist
       * If there is no track, the current track is set to the first track in the playlist and music is paused
       * This function should be called whenever a song has been removed from the playlist
       *
       * @param $index The index (in the playlist) where the removed song was
       * @param song The removed song
       */
      $scope.songRemoved = function($index, song){
        if($scope.playlist[$index] && song.id === angularPlayer.getCurrentTrack()){
          angularPlayer.playTrack($scope.playlist[$index].id);
        }
        else if($scope.playlist[0] && song.id === angularPlayer.getCurrentTrack()){
          angularPlayer.playTrack($scope.playlist[0].id);
          angularPlayer.pause();
        }
      };

      /**
       * Toggles mute on or off
       */
      $scope.toggleMute = function(){
        if($scope.volume == 0) {
          $scope.setVolume(unMutedVolume);
          $('#volume-slider').slider('setValue',unMutedVolume);
        }
        else{
          unMutedVolume = $scope.volume;
          $scope.setVolume(0);
          $('#volume-slider').slider('setValue',0);
        }
      };

      /**
       * Initializes the volume slider in the player footer
       */
      var initVolumeSlider = function(){
        var volumeSlider = $("#volume-slider");
        volumeSlider.slider({ min: 0, max: 100, value: $scope.volume });

        volumeSlider.on("slide", function(slideEvt) {
          $scope.setVolume(slideEvt.value);
        });

        volumeSlider.on("slideStop", function(slideEvt) {
          $scope.setVolume(slideEvt.value);
        });
      };

      /* Controller body starts here */
      var unMutedVolume = PlayerService.getVolume();
      $scope.volume = PlayerService.getVolume();
      $scope.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1; // Identify if user is using chrome.
      $scope.autoPlay = PlayerService.getAutoPlay();

      initVolumeSlider();
    }]);