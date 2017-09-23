import Components from './components';

// The singleton app. We don't need multiple
let app = null;

// This is the starting place.
class App {

  constructor() {
    // If the singleton exists then we don't need to create it again;
    if (!app) {
      this.Components = Components;
      app = this;
    }

    // Return the singleton app
    return app;
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
