import Component from './lib/component'
import Components from './components';

let app = null;

// This is the starting place.
class App {

  constructor() {
    if (!app) {
      this.Components = Components;
      app = this;
    }

    return app;
  }

  static getApp() {
    return new this();
  }

  test() {

  }


  // Interesting iteration syntax
  iterate() {
    let iterate = {
      [Symbol.iterator]() {
        let ind = 0,done = false;
        return {
          next() {
            ind = ind+1;
            done = ind===10 ? true : false;
            return {done: done, value: ind}
          }
        }
      }
    }

    for (var n of iterate) {
      console.log(n);
    }
  }

  arr(c, ...x) {
    return c+x.length;
  }
}

window.App = App;
