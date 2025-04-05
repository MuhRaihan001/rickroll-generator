const fs = require("fs");
const path = require("path");

async function getUrlList(){
    try{
        const filePath = path.join(__dirname, '../custom_urls.json');
        let urls = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const urlamount = urls.length;
        if (!Array.isArray(urls)) return "File is not in expected array format.";
        if (urls.length === 0) return { message: "No URLs found in the list.", status: 404 };
        return { urls: urls, length: urlamount, message: "Url showed", status: 200 };
    }catch(error){
        console.error("Error reading URL list:", error);
        return { message: "Error reading URL list", status: 500 };
    }
}

module.exports = { getUrlList };