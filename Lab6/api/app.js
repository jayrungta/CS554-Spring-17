const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const redisConnection = require("./redis-connection");
const nrpSender = require("./nrp-sender-shim");
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(bodyParser.json());


app.get("/api/people/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "getPersonByID",
            data: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/api/people", async (req, res) => {
    try {
        if(!req.body.first_name)
            throw {message: "Please enter a first name!"};
        if(!req.body.last_name)
            throw {message:"Please enter a last name!"};
        if(!req.body.email)
            throw {message:"Please enter an email!"};
        if(!req.body.gender)
            throw {message:"Please enter a gender!"};    
        if(!req.body.ip_address)
            throw {message:"Please enter an ip address!"};

        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "createPerson",
            data: req.body
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete("/api/people/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "deletePersonByID",
            data: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put("/api/people/:id", async (req, res) => {
    try {
        if(!req.body.first_name)
            throw {message: "Please enter a first name!"};
        if(!req.body.last_name)
            throw {message:"Please enter a last name!"};
        if(!req.body.email)
            throw {message:"Please enter an email!"};
        if(!req.body.gender)
            throw {message:"Please enter a gender!"};    
        if(!req.body.ip_address)
            throw {message:"Please enter an ip address!"};

        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "updatePersonByID",
             data: {
                id: req.params.id,
                newUser: req.body
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});