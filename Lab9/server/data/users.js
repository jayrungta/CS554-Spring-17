const fs = require("fs");
const Promise = require('bluebird');
const path = require("path");
let users;

if (!users) {
    let fileData = fs.readFileSync("lab5.json");
    users = JSON.parse(fileData);
    console.log("Read JSON data.")
}

let exportedMethods = {
    getFirstPage() {
        return new Promise((resolve, reject) => {
            resolve(users.slice(0, 25));
        });
    },

    getUsersList(page) {
        return new Promise((resolve, reject) => {
            resolve(users.slice(page * 25, (page * 25) + 25));
        });
    },

    getUser(id) {
        return new Promise((resolve, reject) => {
            let user = users.filter(function (user) {
                return user.id == id;
            });

            if (user.length == 1) {
                resolve(user[0]);
            } else {
                reject("User Not Found");
            }
        });
    }
}

module.exports = exportedMethods;