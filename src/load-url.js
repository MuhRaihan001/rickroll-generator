const fs = require('fs');
const path = require('path');

function generateHTML(name) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <meta http-equiv="refresh" content="3; url=https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
  
      a {
        color: #1a73e8;
        text-decoration: none;
      }
  
      a:hover {
        text-decoration: underline;
      }
  
      #countdown {
        font-weight: bold;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <p>Redirecting in <span id="countdown">3</span> seconds...</p>
    <p>If you are not redirected automatically, <a href="https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK">click here</a>.</p>
  
    <script>
      let seconds = 3;
      const countdownEl = document.getElementById('countdown');
      const interval = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0; url=https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK">
    </noscript>

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