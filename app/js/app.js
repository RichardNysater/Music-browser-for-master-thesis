'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.plane',
  'myApp.version',
  'angularSoundManager',
  'myApp.player',
  'MusicServices'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/player'});
}]);
