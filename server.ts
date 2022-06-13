import * as express from 'express';
import * as http from 'http';
import { disconnect } from 'process';
import * as WebSocket from 'ws';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

wss.on('connection', (ws: WebSocket) => {
    ws.send('Connected');

    //connection is up, let's add a simple simple event
    //ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        //console.log('0', message);
        //ws.send(`Hello, you sent -> ${message}`);
    //});

    //send immediatly a feedback to the incoming connection

    app.use(express.static(__dirname));
 
    app.get('/', function(req, res){
        res.sendFile("index.html"); 
    });

    app.post('/', function(req,res){
        var code = req.body.code;
        console.log(code);
        wss.clients
            .forEach(client => {
                client.send(code)
            })
    });
}); 


//start our server
server.listen(process.env.PORT || 34197, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});