import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js';
let createCollectionsScripts = require('./middlewares/createCollectionsScripts');

const app = express();

// connect to db
mongoose.connect('mongodb+srv://admin:admin@cluster.wouay.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, function(err, response){
    if (err)
        console.log("An error occurred while establishing connection with mongodb.");
    console.log("Connection has been added.");
});

createCollectionsScripts.createRoles();

app.use(cors());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

routes(app);

export default app;
