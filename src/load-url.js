const fs = require('fs');
const path = require('path');

function generateHTML(name) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${name}</title>
    <meta http-equiv="refresh" content="0;url=https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" />
  </head>
  <body>
    <p>If you are not redirected, <a href="https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK">click here</a>.</p>
  </body>
  </html>`;
}

function loadUrl(app) {
    const filePath = path.join(__dirname, '../custom_urls.json');

    function loadUrls() {
        let urls = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(urls)) return "File is not in expected array format.";
        if (urls.length === 0) return "No URLs found in the list.";

        if (app._router && app._router.stack) {
            app._router.stack = app._router.stack.filter(layer => !layer.route);
        }
        urls.forEach(url => {
            app.get(`/${url}`, (req, res) => {
                res.send(generateHTML(url));
            });
        });
    }
    loadUrls();
    fs.watchFile(filePath, (curr, prev) => {
        loadUrls();
    });
}

module.exports = {loadUrl};