'use strict';

angular.module('myApp.emotions', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/emotions', {
      templateUrl: 'emotions/emotions.html',
      controller: 'EmotionsCtrl'
    });
  }])

  /**
   * The Emotion plane controller handles the interactions within the emotion plane.
   * The emotion plane allows a user to click somewhere in a 2d-plane with four emotions in each corner,
   * the application will then create a playlist based on the distance to each emotion.
   */
  .controller('EmotionsCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'EmotionsService', '$timeout',
    function ($scope, ResourcesService, SongRequestService, EmotionsService, $timeout) {
      const ERROR_DURATION = 3000;
      var activeErrors = 0;

      /**
       * Shows the "No songs found"-error
       * @param duration The duration to show the error for
       */
      var showNoSongsFoundError = function (duration) {
        $scope.showError = true;
        activeErrors++;
        var thisError = activeErrors;
        $timeout(function () {
          if (thisError === activeErrors) { // No new errors have been added during the timeout
            $scope.showError = false;
            activeErrors = 0;
          }
        }, duration);
      };

      /**
       * Callback function which gets called when songs are to be added
       * @param res The added songs
       */
      var addedSongs = function (res) {
        if (res.length === 0) {
          showNoSongsFoundError(ERROR_DURATION);
        }
      };

      /**
       * Set the size of the selection image
       */
      var setImageSize = function () {
        var CSSPlane = $('.plane');
        $scope.imgWidth = CSSPlane.outerWidth() * 1 / (100 / ($scope.featureVariance)*1.1);
        $scope.imgHeight = CSSPlane.outerHeight() * 1 / (100 / ($scope.featureVariance)*1.1);
      };

      /**
       * Calculate the min-max values of each feature based on the distance between the click and the corners
       * @param xCoord The x-coordinate inside the plane.
       * @param yCoord The y-coordinate inside the plane.
       * @param planeWidth The total width of the plane
       * @param planeHeight The total height of the plane
       * @returns {Array} An array with each feature's min and max value calculated
       */
      var calcFeatures = function (xCoord, yCoord, planeWidth, planeHeight) {
        var featureList = [];

        /* Scale the coordinate system to be between -1 and 1 */
        var x = 2 * ((xCoord / planeWidth) - 0.5);
        var y = 2 * (0.5 - (yCoord / planeHeight));

        /* Interpolate the features based on the distance to each emotion
         See http://www.speech.kth.se/prod/publications/files/1344.pdf for the algorithm used */
        for (var i = 0; i < $scope.emotions[0].features.length; i++) {
          var trMax = $scope.topRight.features[i].maxValue;
          var tlMax = $scope.topLeft.features[i].maxValue;
          var blMax = $scope.bottomLeft.features[i].maxValue;
          var brMax = $scope.bottomRight.features[i].maxValue;

          var trMin = $scope.topRight.features[i].minValue;
          var tlMin = $scope.topLeft.features[i].minValue;
          var blMin = $scope.bottomLeft.features[i].minValue;
          var brMin = $scope.bottomRight.features[i].minValue;

          var maxVal = Math.round((0.25 * y * (x * (trMax - tlMax - brMax + blMax) + trMax + tlMax - brMax - blMax))
            + (0.25 * ((x * (trMax - tlMax + brMax - blMax)) + trMax + tlMax + brMax + blMax)));
          maxVal = Math.min($scope.featureVariance + maxVal, 100); // Limit max to 100

          var minVal = Math.round(0.25 * y * (x * (trMin - tlMin - brMin + blMin)
            + trMin + tlMin - brMin - blMin) + 0.25 * (x * (trMin - tlMin + brMin - blMin) + trMin + tlMin + brMin + blMin));
          minVal = Math.max(minVal - $scope.featureVariance, 0); // Limit min to 0

          featureList.push({
            "feature": {"id": $scope.emotions[0].features[i].feature},
            "minValue": minVal,
            "maxValue": maxVal
          });
        }
        return featureList;
      };

      /**
       * Returns the inner width of the plane
       * @returns {*|jQuery}
       */
      var getPlaneWidth = function () {
        return $('.plane').innerWidth();
      };

      /**
       * Returns the inner height of the plane
       * @returns {*|jQuery}
       */
      var getPlaneHeight = function () {
        return $('.plane').innerHeight();
      };

      /**
       * Return where on the plane's x-axis (width) the selection marker is
       * @returns {number} 0 for the furthest left and 1 for furthest right
       */
      var getSelectionXPercent = function () {
        return ($scope.imgLeft - $('.plane').offset().left) / getPlaneWidth();
      };

      /**
       * Return where on the plane's y-axis (height) the selection marker is
       * @returns {number} 0 for the furthest top and 1 for furthest bottom
       */
      var getSelectionYPercent = function () {
        return ($scope.imgTop - $('.plane').offset().top) / getPlaneHeight();
      };

      /**
       * Sets the plane's offsets (used to position selection image)
       * @param offset The plane's offsets
       */
      var setOffsets = function (offset) {
        $scope.leftPlaneOffset = offset.left;
        $scope.topPlaneOffset = offset.top;
      };

      /**
       * planeClick is called whenever a user clicks on the 2d-plane
       * @param event Event
       */
      $scope.planeClick = function (event) {
        $scope.showError = false;
        var CSSPlane = $('.plane');
        setImageSize();
        setOffsets(CSSPlane.offset());
        var planeWidth = CSSPlane.outerWidth();
        var planeHeight = CSSPlane.outerHeight();

        /* Calculate the location of the selection image */
        $scope.imgLeft = event.pageX - ($scope.imgWidth / 2);
        $scope.imgTop = event.pageY - ($scope.imgHeight / 2);
        /* Calculate the features required to request for music */
        var featureList = calcFeatures(event.offsetX, event.offsetY, planeWidth, planeHeight);
        SongRequestService.playMatchingSongs(featureList, addedSongs);
        EmotionsService.setLastRequest(SongRequestService.getRequestAmount());
        $scope.featureList = featureList;

        // Save the current variables used for the click
        EmotionsService.saveClick($scope.imgLeft, $scope.imgTop, $scope.imgWidth, $scope.imgHeight, $scope.featureList, getSelectionXPercent(), getSelectionYPercent());
      };

      /**
       * Updates the image position and size and saves it.
       */
      var updateWindow = function () {
        setImageSize();
        var CSSPlane = $('.plane');
        setOffsets(CSSPlane.offset());
        $scope.imgLeft = CSSPlane.offset().left + getPlaneWidth() * EmotionsService.getSavedValues().selectionImgXPercent;
        $scope.imgTop = CSSPlane.offset().top + getPlaneHeight() * EmotionsService.getSavedValues().selectionImgYPercent;
        EmotionsService.saveClick($scope.imgLeft, $scope.imgTop, $scope.imgWidth, $scope.imgHeight, $scope.featureList, getSelectionXPercent(), getSelectionYPercent());
      };

      /**
       * Initialize the image position and size.
       */
      var initWindow = function () {
        setImageSize();
        var CSSPlane = $('.plane');
        setOffsets(CSSPlane.offset());
        $scope.imgLeft = CSSPlane.offset().left + getPlaneWidth() * EmotionsService.getSavedValues().selectionImgXPercent;
        $scope.imgTop = CSSPlane.offset().top + getPlaneHeight() * EmotionsService.getSavedValues().selectionImgYPercent;
      };

      /**
       * If the user has previously clicked somewhere, load the values for the previous click
       */
      var loadValues = function () {
        var prevValues = EmotionsService.getSavedValues();
        if(EmotionsService.getLastRequest() == SongRequestService.getRequestAmount()) {
          $scope.imgWidth = prevValues.imgWidth;
          $scope.imgHeight = prevValues.imgHeight;
          $scope.imgLeft = prevValues.imgLeft;
          $scope.imgTop = prevValues.imgTop;
          $scope.featureList = prevValues.featureList;

          if (getSelectionXPercent() != prevValues.selectionImgXPercent || getSelectionYPercent() != prevValues.selectionImgYPercent) {
            initWindow();
          }
          else{
            setOffsets($('.plane').offset());
          }
        }
      };

      /**
       * Initializes the handling of window resizing
       */
      var initWindowHandling = function () {
        var oldWidth = getPlaneWidth();

        $(window).on('resize.doResize', function () {
          var newWidth = getPlaneWidth();
          var updateStuffTimer;

          if (newWidth !== oldWidth) {
            $timeout.cancel(updateStuffTimer);
          }

          updateStuffTimer = $timeout(function () {
            updateWindow();
            oldWidth = newWidth;
          }, 100);
        });

        $scope.$on('$destroy', function () {
          $(window).off('resize.doResize'); // remove the handler added earlier
        });
      };

      /**
       * Sets that the page has fully loaded
       */
      var setPageLoaded = function() {
        $timeout(function () {
          $scope.pageLoaded = true;
        });
      };

      /* Controller body starts here */
      $scope.featureVariance = 5;

      // Get labels, initialize select boxes and load existing values
      ResourcesService.Labels.emotions().$promise.then(function (data) {
        $scope.emotions = data;
        loadValues(data);
        $scope.topLeft = data[0];
        $scope.bottomRight = data[1];
        $scope.topRight = data[2];
        $scope.bottomLeft = data[3];
        setPageLoaded();
      }, function (err) {
        throw "No emotions were returned by query: " + err;
      });

      // Handle window resizing
      initWindowHandling();

    }]);