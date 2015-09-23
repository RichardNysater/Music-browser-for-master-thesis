'use strict';

angular.module('myApp.player', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/player', {
    templateUrl: 'player/player.html',
    controller: 'PlayerController'
  });
}])

.controller('PlayerController', ['$scope',
  function ($scope) {
    $scope.Math = window.Math;

    $scope.setvolume = function(volume){
      $scope.volume = volume;
    };
    $scope.calc = function(){
      return $scope._get_html5_duration();
    };

    $scope.calcPercent = function(){
      var duration = textToSec($scope.currentDuration);
      var cur = textToSec($scope.currentPostion);

      return (cur/duration)*100;

    };

     var textToSec = function (duration) {
      var array = duration.split(":");
      return parseInt(array[0])*60+parseInt(array[1]);
    };


    $scope.songs = [
      {
        id: 'one',
        title: 'Test1',
        artist: 'Testartist1',
        url: '/app/music/test1.mp3'
      },
      {
        id: 'two',
        title: 'Test2',
        artist: 'Testartist2',
        url: '/app/music/test2.wav'
      },
      {
        id: 'three',
        title: 'Test3',
        artist: 'Testartist3',
        url: '/app/music/test4.mp3'
      }
    ];
  }]);