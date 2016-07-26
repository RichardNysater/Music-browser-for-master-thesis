'use strict';

var IndexController = angular.module('myApp.IndexController', []);

/**
 * IndexController controls the index-template.
 */
IndexController.controller('IndexController', ['$scope', '$location', 'IndexService',
  function ($scope, $location, IndexService) {

    /**
     * Initializes the main menu sections
     */
    $scope.initNavbar = function () {
      var sectionLink = $location.path().split("/")[1];
      IndexService.setSelected(IndexService.getSectionFromLink(sectionLink));
    };

    /**
     * Returns true if section is selected, false otherwise
     * @param section The section to check if selected
     * @returns {boolean} True if selected, false otherwise
     */
    $scope.isSelected = function (section) {
      return IndexService.isSelected(section);
    };

    /**
     * Sets a section as the current one
     * @param section The section to set as selected
     */
    $scope.setSelected = function (section) {
      IndexService.setSelected(section);
    };

    /* Initialize the main menu */
    $scope.initNavbar();
    $scope.sections = IndexService.sections;
    $scope.helpSections = IndexService.helpSections;
  }]);