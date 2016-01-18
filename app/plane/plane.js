'use strict';

angular.module('myApp.plane', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/plane', {
      templateUrl: 'plane/plane.html',
      controller: 'PlaneCtrl'
    });
  }])

  /**
   * The Plane controller handles the interactions within the plane.
   * The plane allows a user to click somewhere in a 2d-plane with perceptual features as x-axis and y-axis,
   * the application will then create a playlist based on where the user clicked.
   */
  .controller('PlaneCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'PlaneService', '$timeout',
    function ($scope, ResourcesService, SongRequestService, PlaneService, $timeout) {
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
        $scope.imgWidth = CSSPlane.outerWidth() * 1 / (100 / ($scope.featureVariance * 2));
        $scope.imgHeight = CSSPlane.outerHeight() * 1 / (100 / ($scope.featureVariance * 2));
      };

      /**
       * Updates the selection image and plays songs based on the current selection after variance is changed
       */
      $scope.varianceChanged = function () {
        var prevPageX = $scope.imgLeft + ($scope.imgWidth / 2);
        var prevPageY = $scope.imgTop + ($scope.imgHeight / 2);
        setImageSize();

        $scope.imgLeft = prevPageX - ($scope.imgWidth / 2);
        $scope.imgTop = prevPageY - ($scope.imgHeight / 2);
        PlaneService.saveClick($scope.featureVariance, $scope.firstSelect, $scope.secondSelect, $scope.imgLeft, $scope.imgTop, $scope.imgWidth, $scope.imgHeight,
          getSelectionXPercent(), getSelectionYPercent(), $scope.xPercent, $scope.yPercent);
        playSongs();
      };

      /**
       * Sets the min and max values for the selected perceptual features based on variance.
       */
      var setFeatureRanges = function () {
        $scope.xMinValue = Math.max($scope.xPercent - $scope.featureVariance, 0);
        $scope.xMaxValue = Math.min($scope.xPercent + $scope.featureVariance, 100);

        $scope.yMinValue = Math.max($scope.yPercent - $scope.featureVariance, 0);
        $scope.yMaxValue = Math.min($scope.yPercent + $scope.featureVariance, 100);
      };

      /**
       * Fetches and plays songs based on where the user clicked and what the variance is set to
       */
      var playSongs = function () {
        setFeatureRanges();
        var xFeature = {
          feature: {id: $scope.firstSelect.id},
          minValue: $scope.xMinValue,
          maxValue: $scope.xMaxValue
        };
        var yFeature = {
          feature: {id: $scope.secondSelect.id},
          minValue: $scope.yMinValue,
          maxValue: $scope.yMaxValue
        };

        SongRequestService.playMatchingSongs([xFeature, yFeature], addedSongs);
        PlaneService.setLastRequest(SongRequestService.getRequestAmount());
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
       * Sets the selection image and plays music based on where the user clicked
       * @param event Event
       */
      $scope.planeClick = function (event) {
        $scope.showError = false;
        var CSSPlane = $('.plane');
        setImageSize();
        setOffsets(CSSPlane.offset());
        $scope.imgLeft = event.pageX - ($scope.imgWidth / 2);
        $scope.imgTop = event.pageY - ($scope.imgHeight / 2);

        $scope.xPercent = Math.round(100 * (event.offsetX / CSSPlane.outerWidth()));
        $scope.yPercent = 100 - Math.round(100 * (event.offsetY / (CSSPlane.outerHeight())));

        // Save the current variables used for the click
        PlaneService.saveClick($scope.featureVariance, $scope.firstSelect, $scope.secondSelect, $scope.imgLeft, $scope.imgTop, $scope.imgWidth, $scope.imgHeight,
          getSelectionXPercent(), getSelectionYPercent(), $scope.xPercent, $scope.yPercent);

        playSongs();
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
       * Updates the image position and size and saves it.
       */
      var updateWindow = function () {
        setImageSize();
        var CSSPlane = $('.plane');
        setOffsets(CSSPlane.offset());
        $scope.imgLeft = CSSPlane.offset().left + getPlaneWidth() * PlaneService.getSavedValues().selectionImgXPercent;
        $scope.imgTop = CSSPlane.offset().top + getPlaneHeight() * PlaneService.getSavedValues().selectionImgYPercent;
        PlaneService.saveUpdatedWindow($scope.imgLeft, $scope.imgWidth, $scope.imgHeight, getSelectionXPercent(), getSelectionYPercent());
      };

      /**
       * Initialize the image position and size.
       */
      var initWindow = function () {
        setImageSize();
        var CSSPlane = $('.plane');
        setOffsets(CSSPlane.offset());
        $scope.imgLeft = CSSPlane.offset().left + getPlaneWidth() * PlaneService.getSavedValues().selectionImgXPercent;
        $scope.imgTop = CSSPlane.offset().top + getPlaneHeight() * PlaneService.getSavedValues().selectionImgYPercent;
      };

      /**
       * If the user has previously clicked somewhere, load the values for the previous click
       * @param features The features available.
       */
      var loadValues = function (features) {
        var prevValues = PlaneService.getSavedValues();
        if (prevValues.featureVariance) {
          $scope.featureVariance = prevValues.featureVariance;
        }
        else {
          $scope.featureVariance = 13; // Default variance
        }

        for (var i = 0; i < features.length; i++) { // Existing features should be selected in the select boxes
          if (prevValues.firstSelect && features[i].id == prevValues.firstSelect.id) {
            $scope.firstSelect = features[i];
          }

          if (prevValues.secondSelect && features[i].id == prevValues.secondSelect.id) {
            $scope.secondSelect = features[i];
          }
        }

        // Only load selection marker location if no request was done elsewhere
        if (SongRequestService.getRequestAmount() === PlaneService.getLastRequest()) {
          $scope.imgWidth = prevValues.imgWidth;
          $scope.imgHeight = prevValues.imgHeight;
          $scope.imgLeft = prevValues.imgLeft;
          $scope.imgTop = prevValues.imgTop;

          if (getSelectionXPercent() != prevValues.selectionImgXPercent || getSelectionYPercent() != prevValues.selectionImgYPercent) { // Update the window if required
            initWindow();
          }
          else{
            setOffsets($('.plane').offset());
          }

          $scope.xPercent = prevValues.xPercent;
          $scope.yPercent = prevValues.yPercent;

          setFeatureRanges();
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
       * Sets that the page has fully loaded after 400 ms
       */
      var setPageLoaded = function() {
        $scope.pageLoaded = true;
        $timeout(function () {
          $scope.sliderLoaded = true;
          $timeout(function () {
            $scope.$broadcast('rzSliderForceRender'); // Tell the selection slider to render itself
          });
        }, 400);
      };

      /* Controller body starts here */

      //Get features and load existing values
      ResourcesService.Features.query().$promise.then(function (data) {
        $scope.features = data;
        loadValues(data);
        if (!$scope.firstSelect) {
          $scope.firstSelect = $scope.features[0];
        }
        if (!$scope.secondSelect) {
          $scope.secondSelect = $scope.features[$scope.features.length - 1];
        }
        setPageLoaded();
      }, function (err) {
        throw "No features were returned by query: " + err;
      });

      // Handle window resizing
      initWindowHandling();
    }]);