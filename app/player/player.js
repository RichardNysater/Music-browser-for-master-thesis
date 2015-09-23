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
    $scope.setvolume = function(volume){
      $scope.volume = volume;
    }

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
        url: '/app/music/test3.mp3'
      }
    ];
  }]);