'use strict';

/**
 * indexController controls the index-template.
 */
var controllers = angular.module('myApp.indexController', []);

controllers.controller('indexController', ['$scope', '$location',
  function ($scope, $location) {

    /**
     * Handle the fixed navbar
     */
    var selected = null;
    $scope.sections = [
      {"id": "Home", "link": "#/"},
      {"id": "Emotions", "link": "#emotions"},
      {"id": "Plane", "link": "#plane"},
      {"id": "Sliders", "link": "#sliders"},
      {"id": "Feedback", "link": "#feedback"}
    ];

    /**
     * Initializes the main menu sections
     */
    $scope.initPath = function () {
      var initPath = $location.path().split("/")[1] || "Home";
      selected = $scope.sections[0];

      for (var i = 0; i < $scope.sections.length; i++) { // Highlights the current location on the navbar
        if ($scope.sections[i].link === '#' + initPath) {
          selected = $scope.sections[i];
          break;
        }
      }
    };

    /**
     * Returns true if section is selected, false otherwise
     * @param section The section to check if selected
     * @returns {boolean} True if selected, false otherwise
     */
    $scope.isSelected = function (section) {
      return (section === selected);
    };

    /**
     * Sets a section as the current one
     * @param section The section to set as selected
     */
    $scope.setSelected = function (section) {
      selected = section;
    };

    /**
     * Returns the home section
     * @returns {*} The home section
     */
    $scope.getHome = function () {
      return $scope.sections[0];
    };

    /* Initialize the main menu */
    $scope.initPath();
  }]);