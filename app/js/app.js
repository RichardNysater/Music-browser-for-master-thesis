'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'rzModule',
  'ngAnimate',
  'angularSoundManager',

  'myApp.plane',
  'myApp.indexController',
  'myApp.home',
  'myApp.emotions',
  'myApp.sliders',
  'myApp.version',
  'myApp.player',

  'PlaneService',
  'SlidersService',
  'MusicService',
  'SongRequestService',
  'EmotionService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
