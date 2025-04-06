const fs = require('fs');
const path = require('path');

async function addUrl(name, description){
    try{
        const filePath = path.join(__dirname, '../custom_urls.json');
        let urls = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if(!Array.isArray(urls))return {status: 404, message: "File is not in expected array format."};
        if(urls.includes(name)) return {status: 404, message: "URL already exists."};
        
        if(!/^[a-zA-Z0-9-_]+$/.test(name)) {
            return { status: 400, message: "Invalid characters in URL name." };
        }

        const formatUrl = {
            url: name,
            description: description
        }
        
        urls.push(formatUrl);
        fs.writeFileSync(filePath, JSON.stringify(urls, null, 2));
        return {status: 200, message: "URL added successfully.", url: name};
    }catch(error){
        console.error("Error adding URL:", error);
    }
}

module.exports = { addUrl };