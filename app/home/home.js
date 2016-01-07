angular.module('myApp.home', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    });
  }])

  /**
   * The home controller handles the /home page.
   */
  .controller('HomeController', ['$scope',
    function ($scope) {

    }]);