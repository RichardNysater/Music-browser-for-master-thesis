'use strict';

angular.module('myApp.player', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/player', {
    templateUrl: 'player/player.html',
    controller: 'PlayerController'
  });
}])

.controller('PlayerController', ['$scope','Api','angularPlayer',
  function ($scope, Api,angularPlayer) {
    $scope.songs = Api.Music.query(); //Inject songs into scope
    /**
     * Sets current volume
     * @param volume The volume (0-100) to play at
     */
    $scope.setvolume = function(volume){
      $scope.volume = volume;
    };



    /**
     * Calculate how far into the song the user has gotten
     * @returns {number} Returns the current position in percent
     */
    $scope.songProgressPercent = function(){
      var duration = textToSec($scope.currentDuration);
      var cur = textToSec($scope.currentPostion);

      return (cur/duration)*100;

    };

    $scope.lmao = function (event) {
      $scope.ayy = "Tjena";
      var sound = soundManager.getSoundById(angularPlayer.getCurrentTrack());


      sound.setPosition((($scope.seekPercent(event)/100)*textToSec($scope.currentDuration))*1000);

    };

    $scope.seekPercent = function(event) {
      var x = event.offsetX;
      var percent = Math.round(100*(x/$('.seeking').outerWidth()));

      return percent;
    };


    $scope.ayy = function(){

    };
    /**
     * Help method to translate the current duration in text (e.g "1:30") to numbers
     * @param duration The duration in text to translate
     * @returns {number} Returns the duration in seconds
     */
     var textToSec = function (duration) {
      var array = duration.split(":");
      return parseInt(array[0])*60+parseInt(array[1]);
    };

  }]);