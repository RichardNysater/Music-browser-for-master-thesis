var FeedbackService = angular.module('FeedbackService', ['ngCookies']);

/**
 * Stores user feedback both in current session and persistently (in cookies)
 */
FeedbackService.service('FeedbackService', ['$cookies', function ($cookies) {
  var feedback = {};

  if($cookies.get('feedback')) {
    feedback = JSON.parse($cookies.get('feedback'));
  }

  /**
   * Saves feedback for a question
   * @param questionID The question the user submitted feedback for
   * @param rating The rating selected (if applicable)
   * @param comment The comment submitted (if applicable)
   */
  this.saveFeedback = function (questionID, rating, comment) {
    if ($cookies.get('feedback')) {
      feedback = JSON.parse($cookies.get('feedback'));
    }

    feedback[questionID] = {
      rating: rating,
      comment: comment
    };

    $cookies.put('feedback', JSON.stringify(feedback));
  };

  /**
   * Returns the saved feedback
   */
  this.getFeedback = function(){
    return feedback;
  };

}]);