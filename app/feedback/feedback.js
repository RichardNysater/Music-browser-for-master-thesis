angular.module('myApp.feedback', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feedback', {
      templateUrl: 'feedback/feedback.html',
      controller: 'FeedbackController'
    });
  }])

  .controller('FeedbackController', ['$scope', 'Api',
    function ($scope, Api) {

      $scope.buttons = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}, {val: 10}];

      Api.Feedback.query().$promise.then(function (data) {
        $scope.evaluations = data;
      }, function (err) {
        throw "No feedback was returned by query: " + err;
      });

    }]);