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
var jsonToLua = require("json_to_lua")
const { format, parse } = require('lua-json')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

async function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
        do {
        currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    let CLIENTS = []
    
wss.on('connection', function (ws, req) {

    ws.on('close', function () {
        for (i in CLIENTS) {
            if (CLIENTS[i].ws == ws) {
                CLIENTS.splice(i, 1)
            }
        }
    })

    const parameters = url.parse(req.url, true);
    let BUSY, name = parameters.query.myName, TurtleX = +parameters.query.x, TurtleY = +parameters.query.y, TurtleZ = +parameters.query.z
    function AddClientToAnArray(names, wss, array) {
        let template = {
        name: names,
        ws: wss
        }
        array.push(template)
        return array;
    };

    function template(name, xx, yy, zz) {
        let template = {
            name: name,
            TurtleCords: [{x: xx, y: yy, z: zz}],
            Blocks: []
        }
        return template;
    };

    function AddClient(name, ws, CLIENTS) {
        let a = false;
        if (CLIENTS.length == 0) {
            CLIENTS = AddClientToAnArray(name, ws, CLIENTS)
            return CLIENTS;
        } else {
            for (var i in CLIENTS) {
                if (CLIENTS[i].name == name) {
                    a = true
                }
            };
        }
        
        if (a == false) {
            console.log("i did it")
            CLIENTS = AddClientToAnArray(name, ws, CLIENTS)
            return CLIENTS;
        };
        return CLIENTS;
    };

    function idGenerator(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    if (name != "NoName") {
        console.log(name)
        CLIENTS = AddClient(name, ws, CLIENTS)
        console.log(name)
    } else {
        let NewName;

        let FirstData = fs.readFileSync('./src/database/GreekGodsAndMore.json', "utf8")
            FirstData = JSON.parse(FirstData)

            let data = fs.readFileSync('./src/database/names.json', "utf8")
                let broke = 0;
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
                CLIENTS = AddClient(NewName, ws, CLIENTS)
                data.data.push(array)
                data = JSON.stringify(data)
                writeFile("./src/database/names.json", data, (err) => {
                    if (err) throw err;
                })
                ws.send(NewName)
            }

    app.use(express.static(__dirname));
    let code;
    app.post('/pepe', async function (req,res) {
        if (BUSY == true) {
            console.log("sleeping...")
            await sleep(1);
            console.log("finished")
        }

        code = req.body.message;
        let JSONcode = JSON.parse(code)
        let direction = JSONcode.dir
        let toWho = JSONcode.who
        let messageJSON;
        wss.clients.forEach(async function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                BUSY = true
                let ID = idGenerator()
                let codeToSend = {direction, ID}
                codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend))
                client.send(codeToSend)
                client.once('message', function (message) {
                    try {
                        messageJSON = parse("return " + message)
                        if (messageJSON.ID == ID) {
                            console.log(messageJSON)
                            res.send(messageJSON)
                            return messageJSON
                        } else {
                            res.send({boolean: false})
                        }
                    } catch(err) {
                        console.log("error: " + err)
                    }
                    })

                console.log(messageJSON + "  ||  RESPONSE")

                //if (messageJSON.ID == ID) {
                    //messageJSON = JSON.stringify(messageJSON)
                    //res.send(messageJSON)
                //}

                //messagee = JSON.parse(messagee)
                //wss.clients.forEach(function each(client) {
                    //console.log(mesagToSend)
                    //client.send(mesagToSend)
                //})
            }
        })
        console.log(code + " || OT SITE");
    }); // deleted function name kekw

    app.get('/pepe', function (req, res) {
        res.send(messagee);
    });

    app.post('/flood', function (req, res) {     
        let a = req   
    })

    app.post('/utility', function (req, res) {
        if (req.body.message == "give me turtles") {
            let names = []
            for (i in CLIENTS) {
                names.push(CLIENTS[i].name)
            }
            names = JSON.stringify(names)
            console.log(names)
            res.send(names)
        }
    })
});

server.listen(process.env.PORT || 34197, function () {
    console.log("Server started on port ".concat(server.address().port, " :)"));
});
