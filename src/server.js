"use strict";
exports.__esModule = true;
var express = require("express");
var http = require("http");
var WebSocket = require("ws");
var app = express();
//initialize a simple http server
var server = http.createServer(app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
app.use(express.static(__dirname + "/html"));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
wss.on('connection', function (ws) {
    ws.send('Connected');
    //connection is up, let's add a simple simple event
    //ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    //console.log('0', message);
    //ws.send(`Hello, you sent -> ${message}`);
    //});
    //send immediatly a feedback to the incoming connection
    app.use(express.static(__dirname + "/html"));
    app.get('/', function (req, res) {
        res.sendFile("index.html");
    });
    app.post('/', function (req, res) {
        var code = req.body.code;
        console.log(code);
        wss.clients
            .forEach(function (client) {
            client.send(code);
        });
    });
});
//start our server
server.listen(process.env.PORT || 34197, function () {
    console.log("Server started on port ".concat(server.address().port, " :)"));
});
