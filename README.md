## Testing out node.js

### Goals
* Learn more about Node.js
* Get comfortable with ES6 syntax


### Accomplished

#### ES6
Uses Babel.js directly to compile all .js files in `/src` directory to a temporary folder in `/tmp` directory.

* Start with `/lib/build.js` where ES6 files are compiled.
* Compilation occurs in `/lib/builds/es6.js`.

#### Bundling
Uses webpack to bundle js after Babel compilation.

* In `/lib/build.js` after ES6 compilation webpack is used to bundle the `/src` files.
* Webpack uses the `lib/config/webpack.config.js` file to find the correct configuration.
* There is a production and development mode.
  * Development will not minify/uglify
  * Production will minify/uglify
* Running `npm run build` will run the production build and put the final product in `/build/app.js`.
* Running the development server will build in development which will put the final product in `/public/static/app.bundle.js` to be able to test locally.

#### Development server
Yes there are lots of node servers. Yes I built a very-not-for-production one myself to see how node works. There.

* Calling `npm start` will begin with `/index.js` and start the development server.
* Server starts in `/lib/server.js` and uses a controller in `/lib/server/controller.js` to respond based on the route requested.
* The main function is to serve the `/public/index.html` page and `/public/static/app.bundle.js`.
* So use `/public/index.html` for your template...
* Then use `/src` for all your static js files you want on the page.
* **Will re-build js files on page reload.**
* View results at `locahost:3000`.


That's pretty much it. Now it's setup to write ES6 modules in the `/src` folder and get more comfortable with the syntax.
