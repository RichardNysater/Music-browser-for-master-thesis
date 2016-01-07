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
  .controller('PlayerController', ['$scope', 'ResourcesService', 'angularPlayer',
    function ($scope, ResourcesService, angularPlayer) {

    }]);