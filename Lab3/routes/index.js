const path = require('path');

const constructorMethod = (app) => {
    app.get("/", (req, response) => {
        response.render("home", { pageTitle: "Product Portfolio" });
    });

    app.use("/*", (req, response) => {
    let route = path.resolve('public/error.html');
    response.status(404).sendFile(route);    
});
};

module.exports = constructorMethod;