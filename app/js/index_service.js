var IndexService = angular.module('IndexService', ['ngCookies']);

/**
 * The index service stores values relevant to the index-template
 */
IndexService.service('IndexService', ['$cookies', function ($cookies) {

  /**
   * Variables related to the fixed navbar at the top of the site
   */
  var selected = null;

  this.sections = [
    {"id": "Emotions", "link": "#emotions"},
    {"id": "Plane", "link": "#plane"},
    {"id": "Sliders", "link": "#sliders"}
  ];

  this.helpSections = [
    {"id": "Feedback", "link": "#feedback"},
    {"id": "Info", "link": "#info"}
  ];


  /**
   * Returns true if section is selected, false otherwise
   * @param section The section to check if selected
   * @returns {boolean} True if selected, false otherwise
   */
  this.isSelected = function (section) {
    return (section === selected);
  };

  /**
   * Sets a section as the current one
   * @param section The section to set as selected
   */
  this.setSelected = function (section) {
    selected = section;
  };

  /**
   * Gets a section based on its name (id)
   * @param sectionId The section to get
   * @returns section The section corresponding to the sectionId, or null if it does not exist
   */
  this.getSectionFromId = function (sectionId){
    if(!sectionId){
      return null;
    }
    var section = null;
    for (var i = 0; i < this.sections.length; i++) { // Check if sectionId is in sections (left part of navbar)
      if (this.sections[i].id === sectionId) {
        section = this.sections[i];
        break;
      }
    }

    if(section === null) {
      for (i = 0; i < this.helpSections.length; i++) { // Check if sectionId is in help sections (right part of navbar)
        if (this.helpSections[i].id === sectionId) {
          section = this.helpSections[i];
          break;
        }
      }
    }

    return section;
  };

  /**
   * Gets a section based on its link (#XYZ)
   * @param sectionLink The section to get
   * @returns section The section corresponding to the sectionLink, or null if it does not exist
   */
  this.getSectionFromLink = function (sectionLink){
    if(!sectionLink){
      return null;
    }
    if(sectionLink.charAt(0) !== '#'){
      sectionLink = '#'+sectionLink;
    }

    var section = null;
    for (var i = 0; i < this.sections.length; i++) { // Check if sectionLink is in sections (left part of navbar)
      if (this.sections[i].link === sectionLink) {
        section = this.sections[i];
        break;
      }
    }

    if(section === null) {
      for (i = 0; i < this.helpSections.length; i++) { // Check if sectionLink is in help sections (right part of navbar)
        if (this.helpSections[i].link === sectionLink) {
          section = this.helpSections[i];
          break;
        }
      }
    }

    return section;
  };

}]);