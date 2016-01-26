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

      /**
       * Whenever the user has finished writing a comment
       * @param sectionName The name of the section for the comment
       * @param text The comment
       */
      $scope.writtenComment = function (sectionName, text) {
        if (text.length > 1500) { // Disregard text after 1500 characters (very likely spam or garbage input)
          text = text.substring(0, 1500);
        }
        var feedback = {questionID: sectionName, comment: text};
        FeedbackService.saveFeedback(sectionName, text);
        FeedbackSubmitService.submitFeedback(feedback);
      };

      // Initialize values of buttons
      $scope.buttons = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}];

      // Fetch and initialize the evaluation sections
      ResourcesService.Feedback.query().$promise.then(function (data) {
        // Load previously selected ratings for the questions
        var prevFeedback = FeedbackService.getFeedback();
        for (var i = 0; i < data.length; i++) {
          var comment = prevFeedback[data[i].sectionName]; // Exists if a user has input a comment for this section
          if (comment) {
            data[i].comment = comment;
          }

          for (var j = 0; j < data[i].questions.length; j++) {
            var answer = prevFeedback[data[i].questions[j].id]; // Exists if user previously answered question
            if (answer) {
              data[i].questions[j].selected = answer;
            }
          }
        }
        $scope.evaluations = data;
      }, function (err) {
        throw "No feedback was returned by query: " + err;
      });

    }]);