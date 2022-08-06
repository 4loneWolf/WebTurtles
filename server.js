"use strict";
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
var functions = require('./src/functions/functionsServer')
var functionsSite = require('./src/functions/functionsForServerSite')
var bodyParser = require('body-parser');
var url = require('node:url')
const { writeFile, writeFileSync } = require('node:fs');
var jsonToLua = require("json_to_lua")
const { format, parse } = require('lua-json');
const e = require("express");
app.use(express.static(__dirname));
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

    ws.setMaxListeners(10)
    app.setMaxListeners(10)

    ws.on('close', function () {
        for (i in CLIENTS) {
            if (CLIENTS[i].ws == ws) {
                CLIENTS.splice(i, 1)
            }
        }
    });

    const parameters = url.parse(req.url, true);
    let name = parameters.query.myName, TurtleX = +parameters.query.x, TurtleY = +parameters.query.y, TurtleZ = +parameters.query.z, TurtleDirection = parameters.query.direction
    function AddClientToAnArray(names, wss, array) {
        let template = {
        name: names,
        ws: wss
        };
        array.push(template)
        return array;
    }

    function TemplateForUnknownBlock(block, color) {
        let template = {
            block: block,
            color: color
        }
        return template;
    }

    function TemplateForBlock(block, color, x, y, z, SiteX, SiteY, SiteZ) {
        let template = {
            block: block,
            color: color,
            x: x,
            y: y,
            z: z,
            BlockSiteX: SiteX,
            BlockSiteY: SiteY,
            BlockSiteZ: SiteZ
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
    let code, BUSY = false, sent = 0, received = 0;
    
    app.post('/pepe', async function (req,res) {

        if (BUSY == true) {
            setTimeout(function ReturnBUSY() { return BUSY = false}, 600)
        } else {
            BUSY = true
            res.set('Cache-control', 'public, max-age=300');
            code = req.body.message;
            let JSONcode = JSON.parse(code);
                let SiteX = JSONcode.x, SiteY = JSONcode.y, SiteZ = JSONcode.z, whereToGo = JSONcode.dir, toWho = JSONcode.who, direction = JSONcode.direction, SiteID = JSONcode.SiteID;
                let ws, TempName;
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
                ++sent
                console.log("sent", whereToGo, sent)
                ws.once('message', async function (message) {
                    BUSY = false
                    try {
                        let messageJSON = parse("return " + message)
                        ++received
                        console.log("received", messageJSON.whereToGo, received)
                        if (messageJSON.ID == ID) {
                            let data = fs.readFileSync('./src/database/BlockColors.json')
                                data = JSON.parse(data)
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
                                res.send(messageJSON)
                            if (messageJSON.boolean == true) {
                                fs.readFile('./src/database/names.json', async function(err, data) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        data = JSON.parse(data)
                                        for (i in data.data) {
                                            let broke = false;
                                            if (data.data[i].name == toWho) {
                                                let TurtleX = data.data[i].TurtleCords.x, TurtleY = data.data[i].TurtleCords.y, TurtleZ = data.data[i].TurtleCords.z, TurtleDirection = data.data[i].TurtleCords.direction
                                                if (whereToGo == "forward") {
                                                    let NewCords = functions.forward(TurtleDirection, TurtleX, TurtleZ)
                                                    let xx = NewCords[0], zz = NewCords[1]
                                                    data.data[i].TurtleCords.x = xx
                                                    data.data[i].TurtleCords.z = zz
                                                    data.data[i].TurtleCords.SiteX = SiteX
                                                    data.data[i].TurtleCords.SiteZ = SiteZ
                                                } else if (whereToGo == "back") {
                                                    let NewCords = functions.back(TurtleDirection, TurtleX, TurtleZ)
                                                    let xx = NewCords[0], zz = NewCords[1]
                                                    data.data[i].TurtleCords.x = xx
                                                    data.data[i].TurtleCords.z = zz
                                                    data.data[i].TurtleCords.SiteX = SiteX
                                                    data.data[i].TurtleCords.SiteZ = SiteZ
                                                } else if (whereToGo == "up") {
                                                    let yy = ++TurtleY
                                                    data.data[i].TurtleCords.y = yy
                                                    data.data[i].TurtleCords.SiteY = SiteY
                                                } else if (whereToGo == "down") {
                                                    let yy = --TurtleY
                                                    data.data[i].TurtleCords.y = yy
                                                    data.data[i].TurtleCords.SiteY = SiteY                            
                                                } else if (whereToGo == "left") {
                                                    let NewTurtleDirection = functions.left(TurtleDirection)
                                                    data.data[i].TurtleCords.direction = NewTurtleDirection
                                                } else if (whereToGo == "right") {
                                                    let NewTurtleDirection = functions.right(TurtleDirection)
                                                    data.data[i].TurtleCords.direction = NewTurtleDirection
                                                }
                                                const {x, y, z, direction} = data.data[i].TurtleCords;
                                                const {colorUp, colorMiddle, colorDown, up, middle, down} = messageJSON
                                                if (up) {
                                                    let array, deleted = false, pushed = false;
                                                    if (colorUp == undefined) {
                                                        for (var k in data.data[i].Blocks) {
                                                            const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                            if (BlockSiteX == SiteX & BlockSiteY == SiteY + 1 & BlockSiteZ == SiteZ) {
                                                                data.data[i].Blocks.splice(k, 1)
                                                                deleted = true
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (deleted == false) { 
                                                        if (data.data[i].Blocks.length > 0) {
                                                            for (var k in data.data[i].Blocks) {
                                                                const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                                if (BlockSiteX == SiteX & BlockSiteY == SiteY + 1 & BlockSiteZ == SiteZ) {
                                                                    data.data[i].Blocks.splice(k, 1)
                                                                    array = TemplateForBlock(up, colorUp, x, y + 1, z, SiteX, SiteY + 1, SiteZ)
                                                                    data.data[i].Blocks.push(array)
                                                                    pushed = true
                                                                    break;
                                                                }
                                                            }
                                                            if (pushed == false & colorUp != undefined) {
                                                                array = TemplateForBlock(up, colorUp, x, y + 1, z, SiteX, SiteY + 1, SiteZ)
                                                                data.data[i].Blocks.push(array)
                                                            }
                                                        } else {
                                                            array = TemplateForBlock(up, colorUp, x, y + 1, z, SiteX, SiteY + 1, SiteZ)
                                                            data.data[i].Blocks.push(array)
                                                        }
                                                    }
                                                }
                                                if (middle) {
                                                    let xx, zz, BlockX, BlockZ, BlockY = SiteY, array, pushed = false, deleted = false, color = colorMiddle;
                                                    let NewCords = functionsSite.forward(direction, SiteX, SiteZ)
                                                    xx = NewCords[0], zz = NewCords[1]
                                                    NewCords = functions.forward(direction, x, z)
                                                    BlockX = NewCords[0], BlockZ = NewCords[1];
                                                    if (colorMiddle == undefined) {
                                                        for (var k in data.data[i].Blocks) {
                                                            const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                            if (BlockSiteX == xx & BlockSiteY == BlockY & BlockSiteZ == zz) {
                                                                data.data[i].Blocks.splice(k, 1)
                                                                deleted = true
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (deleted == false) {
                                                        if (data.data[i].Blocks.length > 0) {
                                                            for (var k in data.data[i].Blocks) {
                                                                const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                                if (BlockSiteX == xx & BlockSiteY == BlockY & BlockSiteZ == zz) {
                                                                    data.data[i].Blocks.splice(k, 1)
                                                                    array = TemplateForBlock(middle, color, BlockX, y, BlockZ, xx, BlockY, zz)
                                                                    data.data[i].Blocks.push(array)
                                                                    pushed = true
                                                                    break;
                                                                }
                                                            }
                                                            if (pushed == false & colorMiddle != undefined) {
                                                                array = TemplateForBlock(middle, color, BlockX, y, BlockZ, xx, BlockY, zz)
                                                                data.data[i].Blocks.push(array)

                                                            }
                                                        } else {
                                                            array = TemplateForBlock(middle, color, BlockX, y, BlockZ, xx, BlockY, zz)
                                                            data.data[i].Blocks.push(array)
                                                        }
                                                    }
                                                }
                                                if (down) {
                                                    let array, pushed = false, color = colorDown, deleted = false;
                                                    if (color == undefined) {
                                                        for (var k in data.data[i].Blocks) {
                                                            const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                            if (BlockSiteX == SiteX & BlockSiteY == SiteY - 1 & BlockSiteZ == SiteZ) {
                                                                data.data[i].Blocks.splice(k, 1)
                                                                deleted = true
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (deleted == false) {
                                                        if (data.data[i].Blocks.length > 0) {
                                                            for (var k in data.data[i].Blocks) {
                                                                const {BlockSiteX, BlockSiteY, BlockSiteZ} = data.data[i].Blocks[k];
                                                                if (BlockSiteX == SiteX & BlockSiteY == SiteY - 1 & BlockSiteZ == SiteZ) {
                                                                    data.data[i].Blocks.splice(k, 1)
                                                                    array = TemplateForBlock(down, color, x, y - 1, z, SiteX, SiteY - 1, SiteZ)
                                                                    data.data[i].Blocks.push(array)
                                                                    pushed = true
                                                                    break;
                                                                }
                                                            }
                                                            if (pushed == false & colorDown != undefined) {
                                                                array = TemplateForBlock(down, color, x, y - 1, z, SiteX, SiteY - 1, SiteZ)
                                                                data.data[i].Blocks.push(array)
                                                            }
                                                        } else {
                                                            array = TemplateForBlock(down, color, x, y - 1, z, SiteX, SiteY - 1, SiteZ)
                                                            data.data[i].Blocks.push(array)
                                                        }
                                                    }
                                                }
                                                
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
                                    }
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
        } else if (req.body.message.message == "turtle pos, inventory, direction and blocks") {
            fs.readFile('./src/database/names.json', (err, data) => {
                data = JSON.parse(data)
                if (err) {
                    console.log(err)
                } else {
                    for (var i in data.data) {
                        if (req.body.message.name == data.data[i].name) {
                            let direction = data.data[i].TurtleCords.direction, SiteX = 0, SiteY = 0, SiteZ = 0, array = data.data[i].Blocks;
                            for (var k in CLIENTS) {
                                if (req.body.message.name == CLIENTS[k].name) {
                                    ws = CLIENTS[k].ws
                                };
                            }
                            let codeToSend = {whereToGo: "inventory"}, messageJSON, TempArray = [];
                            codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend));
                            ws.send(codeToSend);
                            let w = i
                            ws.once('message', (message) => {
                                messageJSON = parse("return " + message);
                                TempArray.push(messageJSON.Firstblock)
                                TempArray.push(messageJSON.Secondblock)
                                TempArray.push(messageJSON.Thirdblock)
                                TempArray.push(messageJSON.Fourthblock)
                                TempArray.push(messageJSON.Fifthblock)
                                TempArray.push(messageJSON.Sixthblock)
                                TempArray.push(messageJSON.Seventhblock)
                                TempArray.push(messageJSON.Eigthblock)
                                TempArray.push(messageJSON.Ninethblock)
                                TempArray.push(messageJSON.Tenthblock)
                                TempArray.push(messageJSON.Eleventhblock)
                                TempArray.push(messageJSON.Twelfthblock)
                                TempArray.push(messageJSON.Thirteenthblock)
                                TempArray.push(messageJSON.Fourteenfthblock)
                                TempArray.push(messageJSON.Fifteenthblock)
                                TempArray.push(messageJSON.Sixteenthblock)
                                TempArray.push(messageJSON.selectedSlot)
                                console.log(req.body.message.name, " NAMEASSADFEF", data.data[w].name)
                                if (data.data[w].TurtleCords.SiteX != undefined) {
                                    SiteX = data.data[w].TurtleCords.SiteX
                                } else {
                                    data.data[w].TurtleCords.SiteX = SiteX
                                }
                                if (data.data[w].TurtleCords.SiteY != undefined) {
                                    SiteY = data.data[w].TurtleCords.SiteY
                                } else {
                                    data.data[w].TurtleCords.SiteY = SiteY
                                }
                                if(data.data[w].TurtleCords.SiteZ != undefined) {
                                    SiteZ = data.data[w].TurtleCords.SiteZ
                                } else {
                                    data.data[w].TurtleCords.SiteY = SiteY 
                                }
                                console.log(SiteX, SiteY, SiteZ, data.data[w].name)
                                data = JSON.stringify(data)
                                writeFile('./src/database/names.json', data, (err) => {
                                    if (err) throw err;
                                })
                                res.send({direction: direction, x: SiteX, y: SiteY, z: SiteZ, array:array, inventory: TempArray})
                            })
                        }
                    }
                }
            });
        } else if (req.body.message.message == "inventory") {
            for (i in CLIENTS) {
                if (req.body.message.name == CLIENTS[i].name) {
                    ws = CLIENTS[i].ws
                };
            }
            ws.send(jsonToLua.jsonToLua(JSON.stringify({message:req.body.message.message})));
            ws.once('message', (message) => {
                let TempArray = [];
                let messageJSON = parse("return " + message);
                TempArray.push(messageJSON.Firstblock)
                TempArray.push(messageJSON.Secondblock)
                TempArray.push(messageJSON.Thirdblock)
                TempArray.push(messageJSON.Fourthblock)
                TempArray.push(messageJSON.Fifthblock)
                TempArray.push(messageJSON.Sixthblock)
                TempArray.push(messageJSON.Seventhblock)
                TempArray.push(messageJSON.Eigthblock)
                TempArray.push(messageJSON.Ninethblock)
                TempArray.push(messageJSON.Tenthblock)
                TempArray.push(messageJSON.Eleventhblock)
                TempArray.push(messageJSON.Twelfthblock)
                TempArray.push(messageJSON.Thirteenthblock)
                TempArray.push(messageJSON.Fourteenfthblock)
                TempArray.push(messageJSON.Fifteenthblock)
                TempArray.push(messageJSON.Sixteenthblock)
                TempArray.push(messageJSON.selectedSlot)
                res.send({inventory: TempArray})
                return;
            })
        } else if (req.body.message.message == "transfer") {
            let howMany = req.body.message.howMany, toSlot = req.body.message.toSlot;
            for (i in CLIENTS) {
                if (req.body.message.name == CLIENTS[i].name) {
                    ws = CLIENTS[i].ws
                }
            }
            let codeToSend = {message: "transfer", howMany: howMany, toSlot: toSlot}
            codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend));

            ws.send(codeToSend);
            ws.once('message', (message) => {
                let messageJSON = parse("return " + message);
                res.send(messageJSON.boolean)
            })
        } else if (req.body.message.message.substring(0,4) == "drop") {
            for (i in CLIENTS) {
                console.log(CLIENTS[i].name, req.body.message.name)
                if (req.body.message.name == CLIENTS[i].name) {
                    ws = CLIENTS[i].ws
                }
            }
            let codeToSend = {message: req.body.message.message, howMany: req.body.message.count}
            codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend));
            ws.send(codeToSend);
            ws.once('message', (message) => {
                let messageJSON = parse("return " + message);
                console.log(messageJSON.boolean)
                res.send(messageJSON.boolean)
            })

        } else if (req.body.message.message.substring(0,4) == "suck") {
            for (i in CLIENTS) {
                if (req.body.message.name == CLIENTS[i].name) {
                    ws = CLIENTS[i].ws
                }
                req.body.message.message
                let codeToSend = {message: req.body.message.message, howMany: req.body.message.count}
                codeToSend = jsonToLua.jsonToLua(JSON.stringify(codeToSend));
                ws.send(codeToSend);
                ws.once('message', (message) => {
                    let messageJSON = parse("return " + message);
                    res.send(messageJSON.boolean)
                })
            }
        }
    });

    app.post('/UserConnected', (req, res) => {
        console.error(req.body.message)
        res.send("oK")
    })

    app.post('/UserDisconnected', (req, res) => {
        console.log(req.body.message)
        res.send("oK")
    })

    app.post('/exec', (req, res) => {
        console.log(req.body.code)
        let message = req.body.code
        let name = message.split("_").pop()
        message = message.substring(0, message.indexOf('_'))
        for (i in CLIENTS) {
            if (name == CLIENTS[i].name) {
                ws = CLIENTS[i].ws
            };
        }
        ws.send(message)
        ws.once("message", (message) => {
            console.log(message.toString('utf8'), " -- RESPONSE")
        }) 
        console.log(name)
        console.log(message)
    })
});

server.listen(process.env.PORT || 443, function () {
    console.log("Server started on port ".concat(server.address().port, " :)"));
});