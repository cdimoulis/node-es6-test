const match = require('minimatch');

const Router = function(opts) {
  opts = opts || {
    default_routes: [],
  };

  let _routes = [];
  let _actions = [];

  // Add a route to the routes
  // route: (string) the route to match. Uses minimatch for route matching
  // action: (function) the action (funtion callback) to perform. Call back will
  //         have (request, response) passed. It is expected the function will
  //         handle completing the response to the client.
  this.addRoute = (route, action) => {
    if (route && (typeof route) === 'string') {
      if (action && (typeof action) === 'function') {
        let route_len = _routes.push(route);
        let action_len = _actions.push(action);
        if (route_len != action_len) {
          throw `Router Error: Mismatch routes and actions\nroute: ${route}\naction: ${action}`;
        }
      }
      else {
        throw `Router Error: Action must be function for\nroute: ${route}\naction: ${action}`;
      }
    }
    else {
      throw `Router Error: Route must be a string for\nroute: ${route}\naction: ${action}`;
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Adds multiple routes and actions.
  // routes: (array of strings) list of routes to match
  // actions: (array of functions) list of actions to call on match
  // NOTE: There should be a one to one match of routes to actions. That is that
  //  routes[i] will trigger actions[i].
  this.addRoutes = (routes, actions) => {
    if (routes && actions) {
      if (routes.length != actions.length) {
        throw `Router Error: Mismatch routes and actions\nroutes: ${routes}\naction: ${actions}`;
      }

      for (let i = 0; i < routes.length; i++) {
        this.addRoute(routes[i], actions[i]);
      }
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Show the action for the given route
  // Returns the function or -1 if not found
  this.getAction = (route) => {
    let index = _findMatch(route);
    return _actions[index] || -1;
  }

  // If has route
  this.hasRoute = (route) => {
    var index = _routes.indexOf(route);
    return index != -1 ? true : false;
  }

  // Get a pretty listing of the routes
  this.toString = () => {
    let str = '';
    for (let i = 0; i < _routes.length; i++) {
      let route = _routes[i];
      let action = _actions[i].name;
      str += `${route}\t\t${action}\n`;
    }

    return str;
  }


  /***
  * Private FUNCTIONS
  ***/

  // Returns the index of a match or null
  let _findMatch = (route) => {
    let index;
    for (let i = 0; i < _routes.length; i++) {
      let possible = _routes[i];
      if (match(route, possible)) {
        index = i;
        break;
      }
    }
    return index;
  }

}

module.exports = Router;
