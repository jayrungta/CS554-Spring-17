const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const tasks = data.tasks;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        for(let i = 0; i<500; i++){
            tasks.addTask("Task "+i, "description "+i, 2, false);
        }
        return tasks
            .addTask("Make lab",
            "Make the first lab for CS-554. Maybe talk about dinosaurs in it, or something",
            2,
            false
        );
    })
        .then((data) => {
            console.log("Done seeding database");
            db.close();
        });
}, (error) => {
    console.error(error);
});


