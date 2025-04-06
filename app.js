const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { loadUrl } = require("./src/load-url");
const { addUrl } = require("./src/add-url");
const { getUrlList } = require("./src/list-url");
const { loadAPIs } = require("./src/load-api");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

loadUrl(app);
loadAPIs(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})