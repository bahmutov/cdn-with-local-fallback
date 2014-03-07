# CDN with local fallback

> Load JavaScript libraries from CDN with local fallback using yepnope.js

This is a <a href="http://glebbahmutov.com/cdn-with-local-fallback">demo</a>
example showing how to load JavaScript
from CDN with a given timeout. If the script has not been loaded
in the given time limit, the a local script is loaded.

## Goal

Lets say we need **D3** library. We hope that by using
CDN url (http://d3js.org/d3.v3.min.js) to reuse the d3 library
the user might have in his browser cache. This is the good practice,
but sometimes it fails. For example, some of our clients in Asia
experience CDN timeouts for common libraries: jQuery, angular.

I would like to provide a fallback way to load the library from
our *local vendor* folder included with the website. This demo
shows how to do this.

## Setup

I am using [yepnope.js](http://yepnopejs.com/) to load scripts on demand.
This loader script is very small, allows loading JavaScript and CSS
and loads scripts in order depending on the condition (the `test` property).
Here is an example:

```js
// load D3 library if it has not been loaded already
yepnope([{
    test: window.d3, // check if D3 is available
    nope: ['http://d3js.org/d3.v3.min.js'], // try loading from CDN
    complete: function () {
        if (!window.d3) {
            console.log('could not load d3 from CDN, loading local');
            yepnope.injectJs('vendor/d3.v3.min.js', onD3loaded); // fallback
        } else {
            console.log('loaded D3 from CDN');
            onD3loaded();
        }
    }
}]);
```

If any of the libraries were already loaded in the page, the load is skipped using
the test condition `test: window.d3`. The initial load script is loaded form `http://d3js.org`,
once it completes, we check for `window.d3` again, and if it has not been setup,
we try loading the local script included in the `vendor` folder.

## Loading several libraries

yepnope can load multiple libraries in parallel, while giving the result in the correct
sequential order. Just specify multiple test objects in the given array

```js
yepnope([{
  // d3 test just like above
}, {
  // angular library following the same approach
  callback: bootstrapAppFunction
}])
```

The only change required to make AngularJs work is switch from
immediate ng-app code to initialization inside a separate function, for
example called *bootstrapAppFunction*. An example function

```js
function bootstrapAppFunction() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['PieApp']);
    });
    angular.module('PieApp', []) ...
}
```

When using delayed bootstrapping like this, you don't need to declare `ng-app`
attribute.

To make sure our application only is initialized when all libraries are available,
I check the conditions on every library download. If all pass, the application is bootstrapped.

```js
function onAngularLoaded() {
    ...
    // same code in onD3Loaded
    if (window.d3 && window.angular) {
        initApp();
    }
}
```

## Time limits

By default *yepnope* gives up on loading a script after 10 seconds.
You can specify different timeout using `timeout=<ms>!<url>` syntax. For example,
lets try loading d3 from a CDN with 1 second timeout

```js
yepnope([{
    test: window.d3,
    nope: ['timeout=1000!http://d3js.org/d3.v3.min.js'],
    complete: function () {
        if (!window.d3) {
            yepnope.injectJs('vendor/d3.v3.min.js', onD3loaded);
        } else {
            onD3loaded();
        }
    }
}]);
```

If the DNS lookup + library download from d3js.org does not succeed in less than 1000ms,
local callback will start downloading a local version.

## Demo

I created a simple <a href="http://glebbahmutov.com/cdn-with-local-fallback">demo</a>
with a doughnut chart that requires both D3 and Angularjs
scripts. The download limit is determined randomly, the download events are
written to console window. If you refresh several times you should experience
successful / failed CDN events and local download fallbacks.

### author

Follow Gleb Bahmutov [@twitter](https://twitter.com/bahmutov),
see his projects at [glebbahmutov.com](http://glebbahmutov.com/)
