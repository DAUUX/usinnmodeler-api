const express = require('express');
const cors = require("cors");
const routes = require('./routes');
require('./database');
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(cors());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)