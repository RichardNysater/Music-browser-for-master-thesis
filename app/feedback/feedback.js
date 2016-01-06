/**
 * The feedback page allows users to leave feedback on a number of questions regarding
 * the application's different pages as well as general user information.
 */
angular.module('myApp.feedback', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feedback', {
      templateUrl: 'feedback/feedback.html',
      controller: 'FeedbackController'
    });
  }])

  .controller('FeedbackController', ['$scope', 'Api','FeedbackSubmitService',
    function ($scope, Api,FeedbackSubmitService) {

      /**
       * Whenever a user answers a question by clicking a button with a rating
       * send the rating to the server to be added to the database
       * @param question_id The id of the question being answered
       * @param rating The rating chosen
       */
      $scope.buttonClick = function(question_id, rating){
        var feedback = {userID: "test_user", questionID: question_id, rating: rating, comment: null};
        FeedbackSubmitService.submitFeedback(feedback);
      };

      // Initialize values of buttons
      $scope.buttons = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}];

      // Fetch and initialize the evaluation sections
      Api.Feedback.query().$promise.then(function (data) {
        $scope.evaluations = data;
      }, function (err) {
        throw "No feedback was returned by query: " + err;
      });

    }]);