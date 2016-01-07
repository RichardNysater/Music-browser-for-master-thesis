var FeedbackSubmitService = angular.module('FeedbackSubmitService', ['ngResource','ngCookies']);

/**
 * Handle the sending of feedback to the server.
 */
FeedbackSubmitService.service('FeedbackSubmitService', ['$resource', '$http', 'SessionService',
  function ($resource, $http, SessionService) {

    /**
     * Submits the feedback to the server
     * @param feedback The feedback to submit
     * @returns {*} The request's promise
     */
    this.submitFeedback = function (feedback) {
      feedback.userID = SessionService.getUserID();
      var req = {
        method: 'POST',
        url: '/app/api/feedbackSubmit',
        data: {
          feedback: feedback
        }
      };
      return $http(req);
    };
  }
]);

