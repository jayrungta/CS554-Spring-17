const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bluebird = require('bluebird');
const flat = require('flat');
const unflatten = flat.unflatten
const redis = require('redis');
const client = redis.createClient();
const data = require("./data");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let recentList = [];
let users = {};

app.use(bodyParser.json());

app.get("/api/people/history", async (req, res) => {
    if (recentList.length != 0)
        res.status(200).json(recentList.slice(0, 19));
    else
        res.status(404).json("No recent users!");
});

app.get("/api/people/:id", async (req, res) => {
    let findUser = await client.hexistsAsync("users", req.params.id + ".id");
    if (findUser) {
        let flatusers = await client.hgetallAsync("users");
        let users = unflatten(flatusers);
        recentList.unshift(users[req.params.id]);
        res.status(200).json(users[req.params.id]);
    }
    else {
        try {
            let user = await data.getById(req.params.id);
            users[req.params.id] = user;
            let flatusers = flat(users);
            let addUsers = await client.hmsetAsync("users", flatusers);
            recentList.unshift(user);

            res.status(200).json(user);
        }
        catch (e) {
            res.status(500).json("Error: " + e);
        }
    }
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});