'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.plane',
  'myApp.indexController',
  'rzModule',
  'ngAnimate',
  'myApp.sliders',
  'myApp.version',
  'angularSoundManager',
  'myApp.player',
  'MusicService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/player'});
}]);
