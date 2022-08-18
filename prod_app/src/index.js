const express = require('express');
require('./db/mongodb');

// Creating initial app
const app = express();
const port = process.env.PORT || 8000;

// Routers
const userRouter = require('./routers/user');
const itemsRouter = require('./routers/items');

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(userRouter);
app.use(itemsRouter);

app.listen(port, () => {
    console.log('Server is up! Listening port: ' + port);
});

