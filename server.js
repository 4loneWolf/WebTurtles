"use strict";
/* jshint node: true */
exports.__esModule = true;
var express = require("express");
var https = require("https");
var WebSocket = require("ws");
var fs = require('fs');
var path = require('path')
var app = express();
//initialize a simple http server
const options = {
    key: fs.readFileSync('./src/SSL/key.pem'),
    cert: fs.readFileSync('./src/SSL/certificate.pem')
};
var server = https.createServer(options, app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
var bodyParser = require('body-parser');
var url = require('node:url')
var favicon = require('serve-favicon')
const { writeFile, writeFileSync } = require('node:fs');
var jsonToLua = require("json_to_lua")
const { format, parse } = require('lua-json')
app.use(express.static(__dirname));
app.use(favicon(path.join(__dirname, 'src', 'images', 'favicon.ico')))
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

    let CLIENTS = [];
    
wss.on('connection', function (ws, req) {

    ws.on('close', function () {
        for (i in CLIENTS) {
            if (CLIENTS[i].ws == ws) {
                CLIENTS.splice(i, 1)
            }
        }
    });

    const parameters = url.parse(req.url, true);
    let BUSY, name = parameters.query.myName, TurtleX = +parameters.query.x, TurtleY = +parameters.query.y, TurtleZ = +parameters.query.z, TurtleDirection = parameters.query.direction
    function AddClientToAnArray(names, wss, array) {
        let template = {
        name: names,
        ws: wss
        };
        array.push(template)
        return array;
    }

    async function forward(direction, newX, newZ) {
        if (direction == 'north') {
            newZ = --newZ;
        }
        else if (direction == 'south') {
            newZ = ++newZ;
        }
        else if (direction == 'west') {
            newX = --newX;
        }
        else if (direction == 'east') {
            newX = ++newX;
        }
        else {
            console.error('Not a direction');
        }
        return [newX, newZ];
    }

    async function back(direction, newX, newZ) {
        if (direction == 'north') {
            newZ = ++newZ
        } else if (direction == 'south') {
            newZ = --newZ
        } else if (direction == 'west') {
            newX = ++newX
        } else if (direction == 'east') {
            newX = --newX
        } else {
            console.error('Not a direction');
        }
        return [newX, newZ];
    }

    async function left(direction) {
        var newDirection;
        if (direction == 'north') {
            newDirection = 'west';
        }
        else if (direction == 'west') {
            newDirection = 'south';
        }
        else if (direction == 'south') {
            newDirection = 'east';
        }
        else if (direction == 'east') {
            newDirection = 'north';
        }
        else {
            console.error('not a direction');
        }
        return newDirection;
    }

    async function right(direction) {
        var newDirection;
        if (direction == 'north') {
            newDirection = 'east';
        }
        else if (direction == 'east') {
            newDirection = 'south';
        }
        else if (direction == 'south') {
            newDirection = 'west';
        }
        else if (direction == 'west') {
            newDirection = 'north';
        }
        else {
            console.error('not a direction');
        }
        return newDirection;
    }

    function encode(id) {
        let Idlength = id.length
        let result = ""
        let newID = id
        for (var i = Idlength; i > 0; i--) {
            let newerId = newID.substring(0, 1);
            console.log(newerId)
            if (newerId == '0') {
                result = result + "a"
            } else if (newerId == '1') {
                result = result + "b"
            } else if (newerId == '2') {
                result = result + "c"
            } else if (newerId == '3') {
                result = result + "d"
            } else if (newerId == '4') {
                result = result + "e"
            } else if (newerId == '5') {
                result = result + "f"
            } else if (newerId == '6') {
                result = result + "g"
            } else if (newerId == '7') {
                result = result + "h"
            } else if (newerId == '8') {
                result = result + "i"
            } else if (newerId == '9') {
                result = result + "j"
            }
            newID = newID.slice(0 + 1, newID.length);
        }
        console.log(result)
        return result
    }

    function TemplateForUnknownBlock(block, color) {
        let template = {
            block: block,
            color: color
        }
        return template;
    }

    function template(name, xx, yy, zz, TurtleDir) {
        let template = {
            name: name,
            TurtleCords: {x: xx, y: yy, z: zz, direction: TurtleDir},
            Blocks: []
        }
        return template;
    }

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
            CLIENTS = AddClientToAnArray(name, ws, CLIENTS)
            return CLIENTS;
        };
        return CLIENTS;
    }

    function idGenerator(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    if (name != "NoName") {
        console.log(name)
        CLIENTS = AddClient(name, ws, CLIENTS)
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
                let array = template(NewName, TurtleX, TurtleY, TurtleZ, TurtleDirection)
                CLIENTS = AddClient(NewName, ws, CLIENTS)
                data.data.push(array)
                data = JSON.stringify(data)
                writeFile("./src/database/names.json", data, (err) => {
                    if (err) throw err;
                })
                ws.send(NewName)
        }

    let code;
    app.post('/pepe', async function (req,res) {
        res.set('Cache-control', 'public, max-age=300');
        code = req.body.message;
        let JSONcode = JSON.parse(code);
            let SiteX = JSONcode.x, SiteY = JSONcode.y, SiteZ = JSONcode.z, whereToGo = JSONcode.dir, toWho = JSONcode.who, direction = JSONcode.direction;
        let ws, TempName;
        console.log(direction);
        for (i in CLIENTS) {
            if (toWho == CLIENTS[i].name) {
                TempName = CLIENTS[i].name
                ws = CLIENTS[i].ws
            };
        }
        if (TempName != toWho) {
            res.send({message: "Turtle is not connected"});
        } else {
            let ID = idGenerator();
            let codeToSend = {whereToGo, ID};
            codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend));
            ws.send(codeToSend);
            ws.once('message', async function (message) {
                try {
                    let messageJSON = parse("return " + message)
                    if (messageJSON.ID == ID) {
                        fs.readFile('./src/database/BlockColors.json', async function(err, data) {
                            data = JSON.parse(data)
                            if (err) {
                                console.error(err)
                            }
                            var letters = "0123456789ABCDEF";
                            let UpColor = false, FrontColor = false, DownColor = false;
                            for (var i in data.blocks) {
                                if (data.blocks[i].block == messageJSON.up) {
                                    UpColor = data.blocks[i].color
                                }
                                if (data.blocks[i].block == messageJSON.middle) {
                                    FrontColor = data.blocks[i].color 
                                }
                                if (data.blocks[i].block == messageJSON.down) {
                                    DownColor = data.blocks[i].color 
                                }
                            }
                            if (UpColor == false & messageJSON.up != "Noblock") {
                                UpColor = '0x'
                                for (var i = 0; i < 6; i++) {
                                    UpColor += letters[(Math.floor(Math.random() * 16))];
                                }
                                let array = TemplateForUnknownBlock(messageJSON.up, UpColor)
                                data.blocks.push(array)
                            }
                            if (FrontColor == false & messageJSON.middle != "Noblock") {
                                FrontColor = '0x'
                                for (var i = 0; i < 6; i++) {
                                    FrontColor += letters[(Math.floor(Math.random() * 16))];
                                }
                                let array = TemplateForUnknownBlock(messageJSON.middle, FrontColor)
                                data.blocks.push(array)
                            }
                            if (DownColor == false & messageJSON.down != "Noblock") {
                                DownColor = '0x'
                                for (var i = 0; i < 6; i++) {
                                    DownColor += letters[(Math.floor(Math.random() * 16))];
                                }
                                let array = TemplateForUnknownBlock(messageJSON.down, DownColor)
                                data.blocks.push(array)
                            }
                            let array = {
                                data: {
                                up: UpColor,
                                middle: FrontColor,
                                down: DownColor
                                }
                            }
                            messageJSON
                            data = JSON.stringify(data)
                            writeFile('./src/database/BlockColors.json', data, function(err) {
                                if (err) throw err;
                            })

                            if (messageJSON.up != "Noblock") {
                                messageJSON.colorUp = array.data.up
                            }
                            if (messageJSON.middle != "Noblock") {
                                messageJSON.colorMiddle = array.data.middle
                            }
                            if (messageJSON.down != "Noblock") {
                                messageJSON.colorDown = array.data.down
                            }
                            console.log(messageJSON)
                            res.send(messageJSON)
                        })

                        if (messageJSON.boolean == true) {
                            fs.readFile('./src/database/names.json', async function(err, data) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    data = JSON.parse(data)
                                    for (i in data.data) {
                                        let broke = false;
                                        if (data.data[i].name == toWho) {
                                            let x = data.data[i].TurtleCords.x, y = data.data[i].TurtleCords.y, z = data.data[i].TurtleCords.z, TurtleDirection = data.data[i].TurtleCords.direction
                                            if (whereToGo == "forward") {
                                                let NewCords = await forward(TurtleDirection, x, z)
                                                let xx = NewCords[0], zz = NewCords[1]
                                                data.data[i].TurtleCords.x = xx
                                                data.data[i].TurtleCords.z = zz
                                            } else if (whereToGo == "back") {
                                                let NewCords = await back(TurtleDirection, x, z)
                                                let xx = NewCords[0], zz = NewCords[1]
                                                data.data[i].TurtleCords.x = xx
                                                data.data[i].TurtleCords.z = zz
                                            } else if (whereToGo == "up") {
                                                let yy = ++y
                                                data.data[i].TurtleCords.y = yy
                                            } else if (whereToGo == "down") {
                                                let yy = --y
                                                data.data[i].TurtleCords.y = yy                            
                                            } else if (whereToGo == "left") {
                                                let NewTurtleDirection = await left(TurtleDirection)
                                                data.data[i].TurtleCords.direction = NewTurtleDirection
                                            } else if (whereToGo == "right") {
                                                let NewTurtleDirection = await right(TurtleDirection)
                                                data.data[i].TurtleCords.direction = NewTurtleDirection
                                            }
                                            data.data[i].TurtleCords.SiteX = SiteX
                                            data.data[i].TurtleCords.SiteY = SiteY
                                            data.data[i].TurtleCords.SiteZ = SiteZ
                                            data = JSON.stringify(data)
                                            writeFile('./src/database/names.json', data, (err) => {
                                                if (err) throw err;
                                            });
                                            broke = true
                                            break;
                                        }
                                        if (broke == true) {
                                            broke = false
                                            break;
                                        }
                                    }
                                };

                            

                            });
                        };
                        return messageJSON
                    } else {
                        res.send({boolean: false})
                    };
                } catch(err) {
                    console.log("error: " + err)
                }});

                //if (messageJSON.ID == ID) {
                    //messageJSON = JSON.stringify(messageJSON)
                    //res.send(messageJSON)
                //}

                //messagee = JSON.parse(messagee)
                //wss.clients.forEach(function each(client) {
                    //console.log(mesagToSend)
                    //client.send(mesagToSend)
                //})

        console.log(code + " || OT SITE");
        }
    });

    function TemplateForUtility(name, x, y, z) {
        let template = {
            name: name,
            coords: {x, y, z}
        };
        return template;
    }

    app.post('/utility', function (req, res) {
        res.set('Cache-control', 'public, max-age=300')
        if (req.body.message.message == "give me turtles") {
            fs.readFile('./src/database/names.json', (err, data) => {
                data = JSON.parse(data)
                if (err) {
                    console.log(err)
                } else {
                    let message = []
                    for (var i in CLIENTS) {
                        for (var g in data.data) {
                            if (data.data[g].name == CLIENTS[i].name) {
                                message.push(TemplateForUtility(CLIENTS[i].name, data.data[g].TurtleCords.x, data.data[g].TurtleCords.y, data.data[g].TurtleCords.z))
                            }
                        }
                    }
                    res.send(message)
                }})
        } else if (req.body.message.message == "turtle direction and pos") {
            fs.readFile('./src/database/names.json', (err, data) => {
                data = JSON.parse(data)
                if (err) {
                    console.log(err)
                } else {
                    for (i in data.data) {
                        if (req.body.message.name == data.data[i].name) {
                            let direction = data.data[i].TurtleCords.direction
                            console.log(direction)
                            res.send({message: direction, x: data.data[i].TurtleCords.SiteX, y: data.data[i].TurtleCords.SiteY, z: data.data[i].TurtleCords.SiteZ})
                        }
                    }
                }
            });
        } else if (req.body.message.message == "turtle pos and blocks") {

        }
    });
});


server.listen(process.env.PORT || 80, function () {
    console.log("Server started on port ".concat(server.address().port, " :)"));
});

