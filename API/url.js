const express = require("express");
const { addUrl } = require("../src/add-url");
const { getUrlList } = require("../src/list-url");
const route = express.Router();

route.post('/', async (req, res) =>{
    try{
        const { name } = req.body;
        if (!name) return res.status(400).send("Name is required.");
        const formatName = name.replace(/[^a-zA-Z0-9]/g, '');
        const result =  await addUrl(formatName);
        res.status(result.status).send(result);
    }catch(error){
        console.error("Error adding URL:", error);
        res.status(500).send("Failed to add URL. Due to an internal error.");
    }
});

route.get('/', async (req, res) =>{
    try{
        const data = await getUrlList();
        res.status(data.status).send(data);
    }catch(error){
        console.error("Error listing URLs:", error);
        res.status(500).send("Failed to list URLs. Due to an internal error.");
    }
});

module.exports = route;