const fs = require('fs');
const path = require('path');

async function addUrl(name){
    try{
        const filePath = path.join(__dirname, '../custom_urls.json');
        let urls = JSON.parse(fs.readFile(filePath, 'utf8'));
        if(!Array.isArray(urls))return {status: 404, message: "File is not in expected array format."};
        if(urls.includes(name)) return {status: 404, message: "URL already exists."};

        urls.push(name);
        fs.writeFileSync(filePath, JSON.stringify(urls, null, 2));
        return {status: 200, message: "URL added successfully."};
    }catch(error){
        console.error("Error adding URL:", error);
    }
}

module.exports = { addUrl };