const app = require('express')();
var express = require('express');   

const http = require('http').Server(app);
const io = require('socket.io')(http);
const chat = io.of("/search");

const bodyParser = require("body-parser");
const redisConnection = require("./redis-connection");
const nrpSender = require("./nrp-sender-shim");
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(bodyParser.json());

app.use('/bootstrap/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); 
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/jquery/js', express.static(__dirname + '/node_modules/jquery/dist'));

const usersToSocket = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

chat.on('connection', (socket) => {
  socket.emit('request-credentials');

  socket.on('setup', (connectionInfo) => {
    usersToSocket[connectionInfo.username] = socket;
  });

  socket.on('send-message', async (msg) => {
    try {
      let response = await nrpSender.sendMessage({
        redis: redisConnection,
        eventName: "search",
        data: msg
      });
      chat.emit('receive-message', response );
    } catch (e) {
      chat.emit('fail-message', e.message);
    }
  });

});

http.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});