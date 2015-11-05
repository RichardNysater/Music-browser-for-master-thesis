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
  }]);