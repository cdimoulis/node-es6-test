const Util = function() {
  let elements = [];

  this.getElements = (query) => {
    switch(query[0]) {
      case '#': {
        elements = [document.getElementById(query.slice(1))];
        break;
      }
      case '.': {
        elements = document.getElementsByClassName(query.slice(1));
        break;
      }
      default: {
        elements = document.getElementsByTagName(query);
        break;
      }
    }
    return elements;
  };

  this.getElement = (query, index) => {
    index = index || 0;
    return this.getElements(query)[index];
  }

};

module.exports = Util
