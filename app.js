const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const UrlManager = require("./src/urls");
const app = express();
const port = 3000;
const urls = new UrlManager(app);

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post('/api/url', async (req, res) =>{
    try{
        const { name, description } = req.body;
        if (!name) return res.status(400).send("Name is required.");
        const formatName = name.replace(/[^a-zA-Z0-9]/g, '');
        const result =  await urls.addUrl(formatName, description);


        if (result.status === 200) {
            urls.loadUrls(app);
        }

        res.status(result.status).send(result);
    }catch(error){
        console.error("Error adding URL:", error);
        res.status(500).send("Failed to add URL. Due to an internal error.");
    }
});

urls.init();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

module.exports = app;