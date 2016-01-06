var FeedbackService = angular.module('FeedbackService', ['ngCookies']);

/**
 * Stores user feedback both in current session and persistently (in cookies)
 */
FeedbackService.factory('FeedbackService', ['$cookies', function ($cookies) {
  var feedbackService = {};
  feedbackService.feedback = JSON.parse($cookies.get('feedback'));

  /**
   * Saves feedback for a question
   * @param questionID The question the user submitted feedback for
   * @param rating The rating selected (if applicable)
   * @param comment The comment submitted (if applicable)
   */
  feedbackService.saveFeedback = function (questionID, rating, comment) {
    if ($cookies.get('feedback')) {
      feedbackService.feedback = JSON.parse($cookies.get('feedback'));
    }

    feedbackService.feedback[questionID] = {
      rating: rating,
      comment: comment
    };
    $cookies.put('feedback', JSON.stringify(feedbackService.feedback));
  };

  return feedbackService;
}]);