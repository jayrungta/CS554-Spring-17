const fs = require("fs");

let exportedMethods = {
    getById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fs.readFile("lab5.json", (err, fileData) => {
                    if(err)
                    reject(err);
                    
                    let jsonData = JSON.parse(fileData);
                    let user = jsonData.filter(function (user) {
                        return user.id == id;
                    });

                    if (user.length == 1) {
                        resolve(user[0]);
                    } else {
                        reject("User Not Found");
                    }
                });
            }, 5000);
        });
    }
}
module.exports = exportedMethods;