angular.module('myApp.feedback', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feedback', {
      templateUrl: 'feedback/feedback.html',
      controller: 'FeedbackController'
    });
  }])

  /**
   * The feedback page allows users to leave feedback on a number of questions regarding
   * the application's different pages as well as general user information.
   */
  .controller('FeedbackController', ['$scope', 'ResourcesService', 'FeedbackSubmitService', 'FeedbackService',
    function ($scope, ResourcesService, FeedbackSubmitService, FeedbackService) {

      /**
       * Whenever a user answers a question by clicking a button with a rating
       * send the rating to the server to be added to the database
       * @param question The question being answered
       * @param rating The rating chosen
       */
      $scope.buttonClick = function (question, rating) {
        question.selected = rating;
        var feedback = {questionID: question.id, rating: rating};
        FeedbackService.saveFeedback(question.id, rating);
        FeedbackSubmitService.submitFeedback(feedback);
      };

      // Initialize values of buttons
      $scope.buttons = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}];

      // Fetch and initialize the evaluation sections
      ResourcesService.Feedback.query().$promise.then(function (data) {
        // Load previously selected ratings for the questions
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].questions.length; j++) {
            var cur = FeedbackService.getFeedback()[data[i].questions[j].id]; //Exists if user previously answered question
            if (cur) {
              data[i].questions[j].selected = cur.rating;
            }
          }
        }
        $scope.evaluations = data;
      }, function (err) {
        throw "No feedback was returned by query: " + err;
      });

    }]);