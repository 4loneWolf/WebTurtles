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
var url = require('node:url')
const { writeFile } = require('node:fs');
var fs = require('fs');
const { deepStrictEqual } = require("assert");
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

wss.on('connection', function (ws, req) {

    const parameters = url.parse(req.url, true);
    let name = parameters.query.myName, TurtleX = parameters.query.x, TurtleY = parameters.query.y, TurtleZ = parameters.query.z

    function template(name, xx, yy, zz) {
        let template = {
            name: name,
            TurtleCords: [{x: xx, y: yy, z: zz}],
            Blocks: []
        }
        return template;
    }

    if (name != "NoName") {
        console.log(name)
        
    } else {
        let FirstData, NewName, broke;
        fs.readFile('./src/database/GreekGodsAndMore.json', function(err, data) {
            if (err) {
                console.log(err)
            } else {
                data = data.toString('utf8')
                FirstData = JSON.parse(data)
            }

            fs.readFile('./src/database/names.json', function(err, data) {
                let broke = 0;
                if (err) {
                    console.log(err)
                } else {
                    data = data.toString('utf8')
                    data = JSON.parse(data)
                    if (data.data.length == 0) {
                        NewName = FirstData[0]
                        console.log(NewName)
                    } else if (data.data.length == 1) {
                        NewName = FirstData[1]
                        console.log(NewName)
                    } else {
                        for (var i = 0; i < data.data.length; ++i) {
                            for (var a = 1; a < FirstData.length; ++a) {
                                if (FirstData[a] === data.data[i].name) {
                                    break
                                } else if (a == data.data.length) {
                                    broke = true
                                    NewName = FirstData[a]
                                    console.log(NewName)
                                    break
                                }                       
                            }
                            if (broke == true) {
                                break
                            }
                        }
                    }
                    let array = template(NewName, TurtleX, TurtleY, TurtleZ)
                    data.data.push(array)
                    data = JSON.stringify(data)
                    writeFile("./src/database/names.json", data, (err) => {
                        if (err) throw err;
                    })
                    ws.send(NewName)
                }
                });
            });
            fs.readFile('./src/database/names.json', function(err, data) {
                data = data.toString('utf8')
                data = JSON.parse(data)
            })
    };
    //ws.on('message', (message: string) => {
    //console.log('0', message);
    //ws.send(`Hello, you sent -> ${message}`);
    //});

    app.use(express.static(__dirname));
    let code;
    app.post('/pepe', function(req,res) {
        code = req.body.message;
        let JSONcode = JSON.parse(code)
        let codeToSend = JSONcode.dir
        let toWho = JSONcode.who
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                console.log(client.readyState)
                client.send(toWho + codeToSend)
            }
            client.once('message', function abob(message) {
                try {
                    message = message.toString('utf8')
                    message = JSON.parse(message)
                    res.send(message)    
                } catch(err) {
                    console.log("error: " + err)
                }
                    //let count = ws.listenerCount('message')
                    //console.log(count)
                })
        })
        console.log(code + " || OT SITE");
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
