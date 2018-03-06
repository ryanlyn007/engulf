var library_global = require('./library/global');
var socketioLibrary = require('./library/socketconnection');
var dualshockLibrary = require('./library/dualshock');
var express = require('express');
var http = require('http');
var https = require('https');
var app = express(),  //var app = http.createServer(handler);
    app = module.exports.app = express();
var url = require('url');
var HID = require('node-hid');
var fs = require('fs');
const Map = require('es6-map');
const { ActionsSdkApp } = require('actions-on-google');
//const bodyParser = require('body-parser');
//var gpio = require("pi-gpio"); //Note: will only be runnable on raspberry
var forceSsl = require('express-force-ssl');

//app.listen(5000);  //This will open a server at localhost:5000. Navigate to this in your browser.
//var http = require('http');
//http.createServer(app).listen(80);

var key = fs.readFileSync('./encryption/server.key');
var cert = fs.readFileSync( './encryption/server.crt' );
var ca = fs.readFileSync( './encryption/ca.crt' );
var options = {
  key: key,
  cert: cert,
  ca: ca,
  requestCert: true,
  rejectUnauthorized: false
};
var secureServer = https.createServer(options, app).listen('5000', function() {
    console.log("Secure Express server listening on port 5000");
});
var io = require('socket.io')(secureServer);
app.use(forceSsl);

// Create functions to handle intents here
function getPrice(assistant) {
  console.log('** Handling action: ' + PRICE_ACTION);
  let requestURL = 'https://blockchain.info/q/24hrprice';
  request(requestURL, function(error, response) {
    if(error) {
      console.log("got an error: " + error);
      next(error);
    } else {
      let price = response.body;
      logObject('the current bitcoin price: ' , price);
      // Respond to the user with the current temperature.
      assistant.tell("The demo price is  " + price);
    }
  });
}

//function handler (req, res) { // Http handler function

    // Using URL to parse the requested URL
    //var path = url.parse(req.url).pathname;

    // Managing the root route
    // if (path == '/') {
    //     index = fs.readFile(__dirname+'/public/index.html',
    //         function(error,data) {
    //             if (error) {
    //                 res.writeHead(500);
    //                 return res.end("Error: unable to load index.html");
    //             }
    //             res.writeHead(200,{'Content-Type': 'text/html'});
    //             res.end(data);
    //         });
    //} else if (path.indexOf('/endpoint')>=0) {
    app.get('/endpoint', function (req, res, next) {
        var headers = {};
        headers['Content-Type'] = 'application/json; charset=utf-8';
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
        headers['Access-Control-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
        headers["Access-Control-Max-Age"] = '86400';
        res.writeHead(200, headers);
        var q = url.parse(req.url, true).query;
        var txt = '{"x":' + library_global.getRandomInt(100) + ',"y":' + library_global.getRandomInt(100) + '}';   //var txt = "([[3,1],[4,2],[5,6],[6,3],[7,-2],[8,-1],[9,3],[10,7],[11,12],[12,13]])";
        res.write(txt);
        res.end();
      });
    //} else if (path.indexOf('/bitcoin')>=0) {
    app.get('/bitcoin', function (req, res, next) {
        console.log("req.body:" + req.body);
        var headers = {};
        headers['Content-Type'] = 'application/json; charset=utf-8';
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
        headers['Access-Control-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
        headers["Access-Control-Max-Age"] = '86400';
        res.writeHead(200, headers);

        // Instantiate a new API.AI assistant object.
        req.body = "nothing";

        console.log("htt:" + http.get("http://dfdfd") );
        req = this.http;
        const appSDK = new ActionsSdkApp({ request: req, response: res });

        // Declare constants for your action and parameter names
        const PRICE_ACTION = 'price';  // The action name from the API.AI intent

        // Add handler functions to the action router.
        let actionRouter = new Map();
        actionRouter.set(PRICE_ACTION, getPrice);

        // Route requests to the proper handler functions via the action router.
        appSDK.handleRequest(actionRouter);
      });
    // } else {
    //     res.writeHead(404);
    //     res.end("Error: 4041 - File not found:");
    // }
//}

var _socketio = new socketioLibrary(io); //class

var _dualshock = new dualshockLibrary(io); //class
