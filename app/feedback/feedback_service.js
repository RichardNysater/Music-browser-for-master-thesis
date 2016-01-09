var FeedbackService = angular.module('FeedbackService', ['ngCookies']);

/**
 * Stores user feedback both in current session and persistently (in cookies)
 */
FeedbackService.service('FeedbackService', ['$cookies', function ($cookies) {
  var feedback = {};

  /**
   * Saves feedback for a question
   * @param questionID The question the user submitted feedback for
   * @param answer The answer given
   */
  this.saveFeedback = function (questionID, answer) {
    if ($cookies.get('feedback')) {
      feedback = JSON.parse($cookies.get('feedback'));
    }

    feedback[questionID] = answer;

    $cookies.put('feedback', JSON.stringify(feedback));
  };

  /**
   * Returns the saved feedback
   */
  this.getFeedback = function(){
    return feedback;
  };


  if($cookies.get('feedback')) { // Initialize feedback by loading from cookie
    feedback = JSON.parse($cookies.get('feedback'));
  }

}]);