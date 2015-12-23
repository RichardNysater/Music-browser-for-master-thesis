angular.module('myApp.home', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    });
  }])

  .controller('HomeController', ['$scope',
    function ($scope) {

    }]);