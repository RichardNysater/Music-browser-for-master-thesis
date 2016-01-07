var SessionService = angular.module('SessionService', ['ngCookies']);

/**
 * The session service handles the user session
 */
SessionService.service('SessionService', ['$cookies',
  function ($cookies) {

    /**
     * Generate a user ID for a new user
     * @returns {string} A 36 byte user ID for a new user
     */
    var generateUserID = function () {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    };

    /**
     * Returns the user's userID or generates a new one and stores it if it does not yet exist
     * @returns {*|string} The user's userID
     */
    this.getUserID = function () {
      if (!$cookies.get('userID')) {
        $cookies.put('userID', generateUserID());
      }
      return $cookies.get('userID');
    };

  }]);