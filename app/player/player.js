'use strict';

angular.module('myApp.player', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/player', {
      templateUrl: 'player/player.html',
      controller: 'PlayerController'
    });
  }])

  .controller('PlayerController', ['$scope', 'ResourcesService', 'angularPlayer',
    function ($scope, ResourcesService, angularPlayer) {

    }]);