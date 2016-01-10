angular.module('myApp.info', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/info', {
      templateUrl: 'info/info.html',
      controller: 'InfoController'
    });
  }])

  /**
   * The home controller handles the /info page.
   */
  .controller('InfoController', ['$scope',
    function ($scope) {

    }]);