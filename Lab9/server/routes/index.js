const data = require("../data");
const userData = data.users;

const constructorMethod = (app) => {

    app.get("/", (req, res) => {
        userData.getFirstPage().then((userList) => {
            res.json(userList);
        }, () => {
            // Something went wrong with the server!
            res.sendStatus(500);
        });
    });

    app.get("/archive/:page", (req, res) => {
        if (parseInt(req.params.page) > 39 || parseInt(req.params.page) < 0)
            res.redirect("/");
        else {
            userData.getUsersList(parseInt(req.params.page)).then((userList) => {
                res.json(userList);
            }, () => {
                // Something went wrong with the server!
                res.sendStatus(500);
            });
        }
    });

    app.get("/user/:id", (req, res) => {
        userData.getUser(parseInt(req.params.id)).then((user) => {
            res.json(user);
        }).catch(() => {
            res.status(404).json({ error: "User not found" });
        });
    });

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;