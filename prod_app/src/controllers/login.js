const registerView = (req, res) => {
    res.render("register", {
        message: "",
    } );
}
// For View
const loginView = (req, res) => {
    res.render("login", {
        message: ""
    } );
}
module.exports =  {
    registerView,
    loginView
};