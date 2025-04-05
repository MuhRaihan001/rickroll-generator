const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { loadUrl } = require("./src/load-url");
const { addUrl } = require("./src/add-url");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
loadUrl(app);
app.post("/add-url", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Name is required.");
        const formatName = name.replace(/[^a-zA-Z0-9]/g, '');
        const result =  await addUrl(formatName);
        res.status(result.status).send(result);
    }
    catch (error) {
        console.error("Error adding URL:", error);
        res.status(500).send("Failed to add URL. Due to an internal error.");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})