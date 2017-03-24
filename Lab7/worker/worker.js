const redisConnection = require("./redis-connection");
const fs = require("fs");
var https = require('https');
var request = require('ajax-request');

redisConnection.on('search:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    var API_KEY = '4877180-14e32681d4419d640d6c1f183';
    var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(message.data.query);


    request({
        url: URL,
        method: 'GET',
        json: true
    }, function (err, res, body) {
        if (err) {
            console.log("Got error: " + err);
        }
        else {
            let data = body;
            if (parseInt(data.totalHits) > 0) {
                let urls = [];
                data.hits.forEach(function (hit) {
                    urls.push(hit.previewURL);
                }, this);
                let successEvent = `${eventName}:success:${requestId}`;
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data: { urls: urls, message: message.data.msg, username: message.data.username },
                    eventName: eventName
                });
            }
            else {
                let failedEvent = `${eventName}:failed:${requestId}`;
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: { message: "No hits" },
                    eventName: eventName
                });
            }
        }
    });
});
