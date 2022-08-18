const dashboardView = (req, res) => {
    res.render("dashboard", {
        message: "",
        users: [],
        images: [],
    } );
}

const requestsView = (req, res) => {
    res.render("requests", {
        message: "",
        requests: [],
    })
}

module.exports =  {
    dashboardView,
    requestsView
};