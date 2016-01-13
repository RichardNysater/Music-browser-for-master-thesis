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
        var CSS_plane = $('.plane');
        $scope.imgwidth = CSS_plane.outerWidth() * 1 / (100 / ($scope.feature_variance));
        $scope.imgheight = CSS_plane.outerHeight() * 1 / (100 / ($scope.feature_variance));
      };

      /**
       * Calculate the min-max values of each feature based on the distance between the click and the corners
       * @param x_coord The x-coordinate inside the plane.
       * @param y_coord The y-coordinate inside the plane.
       * @param plane_width The total width of the plane
       * @param plane_height The total height of the plane
       * @returns {Array} An array with each feature's min and max value calculated
       */
      var calcFeatures = function (x_coord, y_coord, plane_width, plane_height) {
        var feature_list = [];

        /* Scale the coordinate system to be between -1 and 1 */
        var x = 2 * ((x_coord / plane_width) - 0.5);
        var y = 2 * (0.5 - (y_coord / plane_height));

        /* Interpolate the features based on the distance to each emotion
         See http://www.speech.kth.se/prod/publications/files/1344.pdf for the algorithm used */
        for (var i = 0; i < $scope.emotions[0].features.length; i++) {
          var tr_max = $scope.topright.features[i].maxvalue;
          var tl_max = $scope.topleft.features[i].maxvalue;
          var bl_max = $scope.bottomleft.features[i].maxvalue;
          var br_max = $scope.bottomright.features[i].maxvalue;

          var tr_min = $scope.topright.features[i].minvalue;
          var tl_min = $scope.topleft.features[i].minvalue;
          var bl_min = $scope.bottomleft.features[i].minvalue;
          var br_min = $scope.bottomright.features[i].minvalue;

          var max_val = Math.round((0.25 * y * (x * (tr_max - tl_max - br_max + bl_max) + tr_max + tl_max - br_max - bl_max))
            + (0.25 * ((x * (tr_max - tl_max + br_max - bl_max)) + tr_max + tl_max + br_max + bl_max)));
          max_val = Math.min($scope.feature_variance + max_val, 100); // Limit max to 100

          var min_val = Math.round(0.25 * y * (x * (tr_min - tl_min - br_min + bl_min)
            + tr_min + tl_min - br_min - bl_min) + 0.25 * (x * (tr_min - tl_min + br_min - bl_min) + tr_min + tl_min + br_min + bl_min));
          min_val = Math.max(min_val - $scope.feature_variance, 0); // Limit min to 0

          feature_list.push({
            "feature": {"id": $scope.emotions[0].features[i].feature},
            "minvalue": min_val,
            "maxvalue": max_val
          });
        }
        return feature_list;
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
        return ($scope.imgleft - $('.plane').offset().left) / getPlaneWidth();
      };

      /**
       * Return where on the plane's y-axis (height) the selection marker is
       * @returns {number} 0 for the furthest top and 1 for furthest bottom
       */
      var getSelectionYPercent = function () {
        return ($scope.imgtop - $('.plane').offset().top) / getPlaneHeight();
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
        var CSS_plane = $('.plane');
        setImageSize();
        setOffsets(CSS_plane.offset());
        var plane_width = CSS_plane.outerWidth();
        var plane_height = CSS_plane.outerHeight();

        /* Calculate the location of the selection image */
        $scope.imgleft = event.pageX - ($scope.imgwidth / 2);
        $scope.imgtop = event.pageY - ($scope.imgheight / 2);
        /* Calculate the features required to request for music */
        var feature_list = calcFeatures(event.offsetX, event.offsetY, plane_width, plane_height);
        SongRequestService.playMatchingSongs(feature_list, addedSongs);
        $scope.feature_list = feature_list;

        // Save the current variables used for the click
        EmotionsService.saveClick($scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, $scope.feature_list, getSelectionXPercent(), getSelectionYPercent());
      };

      /**
       * Updates the image position and size and saves it.
       */
      var updateWindow = function () {
        setImageSize();
        var CSS_plane = $('.plane');
        setOffsets(CSS_plane.offset());
        $scope.imgleft = CSS_plane.offset().left + getPlaneWidth() * EmotionsService.getSavedValues().selection_img_x_percent;
        $scope.imgtop = CSS_plane.offset().top + getPlaneHeight() * EmotionsService.getSavedValues().selection_img_y_percent;
        EmotionsService.saveClick($scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, $scope.feature_list, getSelectionXPercent(), getSelectionYPercent());
      };

      /**
       * Initialize the image position and size.
       */
      var initWindow = function () {
        setImageSize();
        var CSS_plane = $('.plane');
        setOffsets(CSS_plane.offset());
        $scope.imgleft = CSS_plane.offset().left + getPlaneWidth() * EmotionsService.getSavedValues().selection_img_x_percent;
        $scope.imgtop = CSS_plane.offset().top + getPlaneHeight() * EmotionsService.getSavedValues().selection_img_y_percent;
      };

      /**
       * If the user has previously clicked somewhere, load the values for the previous click
       */
      var loadValues = function () {
        var prevValues = EmotionsService.getSavedValues();
        $scope.imgwidth = prevValues.imgwidth;
        $scope.imgheight = prevValues.imgheight;
        $scope.imgleft = prevValues.imgleft;
        $scope.imgtop = prevValues.imgtop;
        $scope.feature_list = prevValues.feature_list;

        if (getSelectionXPercent() != prevValues.selection_img_x_percent || getSelectionYPercent() != prevValues.selection_img_y_percent) {
          initWindow();
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

      /* Controller body starts here */
      $scope.feature_variance = 5;

      // Get labels, initialize select boxes and load existing values
      ResourcesService.Labels.emotions().$promise.then(function (data) {
        $scope.emotions = data;
        loadValues(data);
        $scope.topleft = data[0];
        $scope.bottomright = data[1];
        $scope.topright = data[2];
        $scope.bottomleft = data[3];
      }, function (err) {
        throw "No emotions were returned by query: " + err;
      });

      // Handle window resizing
      initWindowHandling();

    }]);