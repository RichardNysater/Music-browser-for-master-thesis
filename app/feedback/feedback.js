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
       * @param question The question being answered
       * @param rating The rating chosen
       */
      $scope.buttonClick = function (question, rating) {
        question.selected = rating;
        var feedback = {questionID: question.id, rating: rating};
        FeedbackService.saveFeedback(question.id, rating);
        FeedbackSubmitService.submitFeedback(feedback);
      };

      /**
       * Whenever the user answers a question by selecting an item in a selectlist
       * @param question The question being answered
       * @param option The option selected
       */
      $scope.selectedOption = function (question, option) {
        question.selected = option;
        var feedback = {questionID: question.id, comment: option.text};
        FeedbackService.saveFeedback(question.id, option);
        FeedbackSubmitService.submitFeedback(feedback);
      };

      // Initialize values of buttons
      $scope.buttons = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}];

      // Fetch and initialize the evaluation sections
      ResourcesService.Feedback.query().$promise.then(function (data) {
        // Load previously selected ratings for the questions
        var prevFeedback = FeedbackService.getFeedback();
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].questions.length; j++) {

            var answer = prevFeedback[data[i].questions[j].id]; //Exists if user previously answered question
            if (answer) {
              data[i].questions[j].selected = answer;
            }
            else if (data[i].questions[j].type === "selectlist") {
              data[i].questions[j].selected = data[i].questions[j].options[0]; //Pre-select first option
              FeedbackSubmitService.submitFeedback({questionID: data[i].questions[j].id, comment:data[i].questions[j].selected.text});
            }
          }
        }
        $scope.evaluations = data;
      }, function (err) {
        throw "No feedback was returned by query: " + err;
      });

    }]);