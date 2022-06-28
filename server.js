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
app.use(express.static(__dirname));
var bodyParser = require('body-parser');
const { table } = require("console");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
        do {
        currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

wss.on('connection', function (ws) {
    ws.send('Connected');

    //ws.on('message', (message: string) => {
    //console.log('0', message);
    //ws.send(`Hello, you sent -> ${message}`);
    //});

    app.use(express.static(__dirname));
    let code;
    app.post('/pepe', function(req,res){
        code = req.body.message;
        ws.send(code)
        console.log(code + " || OT SITE");
        ws.addEventListener('message', function abob(message) {
        try {
            messagee = JSON.parse(message.data)
            res.send(messagee)    
        } catch(err) {
            console.log("error: " + err)
        }
            ws.removeEventListener('message', abob)
        })
    });

    let messagee;

    ws.on('message', function (message) {
        message = message.toString('utf8')
        try {
        messagee = JSON.parse(message)
        console.log(message + " || OT WEBSOCKET")    
        return messagee;
        } catch(err) {
            console.log("error: " + err)
        }
    });

    app.get('/pepe', function (req, res) {
        res.send(messagee);
    });

    app.post('/', function (req, res) {
        console.log(req.body.name)
        var code = req.body.code;
        console.log(code);
        wss.clients
            .forEach(function (client) {
            client.send(code);
        });
    });
    


});

server.listen(process.env.PORT || 34197, function () {
    console.log("Server started on port ".concat(server.address().port, " :)"));
});
