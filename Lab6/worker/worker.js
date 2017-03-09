const redisConnection = require("./redis-connection");
const fs = require("fs");

let jsonData;

if (!jsonData) {
    let fileData = fs.readFileSync("lab5.json");
    jsonData = JSON.parse(fileData);
    console.log("Read JSON data on startup.")
}

redisConnection.on('getPersonByID:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let user = jsonData.filter(function (user) {
        return user.id == message.data.id;
    });

    if (user.length == 1) {
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: user[0],
            eventName: eventName
        });
    } else {
        let failedEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failedEvent, {
            requestId: requestId,
            data: { message: "User Not Found" },
            eventName: eventName
        });
    }
});

redisConnection.on('createPerson:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let lastId = jsonData[jsonData.length - 1].id;
    message.data.id = lastId + 1;
    jsonData.push(message.data);

    let user = jsonData.filter(function (user) {
        return user.id == message.data.id;
    });

    if (user.length == 1) {
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: user[0],
            eventName: eventName
        });
    } else {
        let failedEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failedEvent, {
            requestId: requestId,
            data: { message: "Error in Creating" },
            eventName: eventName
        });
    }
});

redisConnection.on('deletePersonByID:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let userIndex = jsonData.findIndex(function (user) {
        return user.id == message.data.id;
    });

    if (userIndex != -1) {
        jsonData.splice(userIndex, 1);
        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: message.data.id + " Removed Successfully",
            eventName: eventName
        });
    } else {
        let failedEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failedEvent, {
            requestId: requestId,
            data: { message: "No Such User Found" },
            eventName: eventName
        });
    }
});

redisConnection.on('updatePersonByID:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let userIndex = jsonData.findIndex(function (user) {
        return user.id == message.data.id;
    });

    if (userIndex != -1) {
        message.data.newUser.id = parseInt(message.data.id);
        jsonData.splice(userIndex, 1, message.data.newUser);
        let user = jsonData.filter(function (user) {
            return user.id ==  message.data.id;
        });

        let successEvent = `${eventName}:success:${requestId}`;
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: user[0],
            eventName: eventName
        });
    } else {
        let failedEvent = `${eventName}:failed:${requestId}`;
        redisConnection.emit(failedEvent, {
            requestId: requestId,
            data: { message: "No Such User Found" },
            eventName: eventName
        });
    }
});