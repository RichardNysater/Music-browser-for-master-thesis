'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'ngAnimate',

  'rzModule',
  'angularSoundManager',
  'ui-rangeSlider',

  'myApp.IndexController',
  'myApp.plane',
  'myApp.home',
  'myApp.info',
  'myApp.feedback',
  'myApp.emotions',
  'myApp.sliders',
  'myApp.version',
  'myApp.player',
  'myApp.playlist',

  'PlaneService',
  'SlidersService',
  'ResourcesService',
  'SongRequestService',
  'SessionService',
  'FeedbackSubmitService',
  'FeedbackService',
  'EmotionsService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
