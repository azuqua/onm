onm
===

Object namespace manager (onm) node.js and HTML 5 client package sources.

[onm library API documentation](https://github.com/Encapsule/ONMjs/wiki)

# User

## node.js support

Install the onm package via npm:

       npm install onm

Alternately, you may use `npm install onm --save` to install onm, and register a package dependency in your package.json file.

Subsequently, in your node.js JavaScript:

        var onm = require('onm');
        var model = new onm.Model({ "jsonTag": "hello" });
        var store = new onm.Store(model);
        // ...

## html 5 client support

under development. experiemental client script via browserify available in `./dist/client/onm-client.js` (untested).

# Developer

To build and/or modify the onm package sources, clone the git repository, install the package's developer dependency via npm, and then leverage Grunt to invoke the default package build. Use `grunt --help` for detailed build options.

        cd ~/vitalshit/
        git clone git@github.com:Encapsule/onm.git
        cd onm
        npm install
        grunt
        # grunt --help for detailed build options

