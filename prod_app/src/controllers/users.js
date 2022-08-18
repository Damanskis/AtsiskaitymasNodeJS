const usersView = (req, res) => {
    res.render("users", {
        message: "",
        items: [],
    } );
}
module.exports =  {
    usersView,
};