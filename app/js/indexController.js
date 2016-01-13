'use strict';

var IndexController = angular.module('myApp.IndexController', []);

/**
 * IndexController controls the index-template.
 */
IndexController.controller('IndexController', ['$scope', '$location',
  function ($scope, $location) {

    /**
     * Handle the fixed navbar
     */
    var selected = null;
    $scope.sections = [
      {"id": "Emotions", "link": "#emotions"},
      {"id": "Plane", "link": "#plane"},
      {"id": "Sliders", "link": "#sliders"}
    ];

    $scope.helpSections = [
      {"id": "Feedback", "link": "#feedback"},
      {"id": "Info", "link": "#info"}
    ];

    /**
     * Initializes the main menu sections
     */
    $scope.initPath = function () {
      var initPath = $location.path().split("/")[1];

      for (var i = 0; i < $scope.sections.length; i++) { // Highlights the current location on the navbar
        if ($scope.sections[i].link === '#' + initPath) {
          selected = $scope.sections[i];
          break;
        }
      }

      for (i = 0; i < $scope.helpSections.length; i++) { // Highlights the current location on the navbar
        if ($scope.helpSections[i].link === '#' + initPath) {
          selected = $scope.helpSections[i];
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

    /* Initialize the main menu */
    $scope.initPath();
  }]);