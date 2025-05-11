# nw-node-addon-gyp-example

Build Node Addon using `node-gyp`.

## Approach

1. Download NW.js Node headers tarball from https://dl.nwjs.io. For example, for headers for v0.99.1 can be downloaded [here](https://dl.nwjs.io/v0.99.1/nw-headers-v0.99.1.tar.gz).
1. Get the Node version used by the NW.js release version from https://nwjs.io/versions.json. For example, for v0.99.1 the Node version is 23.11.0
1. (Re)build Node addons for NW.js: `node-gyp rebuild --target=23.11.0 --nodedir=/path/to/node/headers/directory`
1. The compiled addon will be at `$PWD/build/Release/{addon_name}.node`. For example, if the `target` value in your `binding.gyp` file is `hello`, then the file will be `$PWD/build/Release/hello.node`.
1. Import the module inside your application: `const { hello } = require('./build/Release/hello');`

Note: This approach works from v0.83 onward.

## Getting Started with demo application

1. Clone repo
1. `npm i` to install Node modules
1. `npm run gyp` to download Node headers and build Node Native Addon
1. `npm run nw` to run NW.js app.
