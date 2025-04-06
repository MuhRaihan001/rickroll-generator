const fs = require('fs');
const path = require('path');

function generateHTML(name, description) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <meta http-equiv="refresh" content="3; url=https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 text-gray-800 flex items-center justify-center flex-col h-screen text-center font-sans">
    <h1 class="text-3xl font-bold mb-4">${name}</h1>
    <p class="text-lg">${description} after countdown finish</p>
    <p class="mt-2 text-sm">Redirecting in <span id="countdown" class="font-semibold">3</span> seconds...</p>
    <p class="mt-1 text-sm">If you are not redirected automatically, <a href="https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" class="text-blue-600 hover:underline">click here</a>.</p>

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

        if (app._router && app._router.stack){
          app._router.stack = app._router.stack.filter(layer => !layer.route);
        }

        urls.forEach(url => {
            app.get(`/${url.url}`, (req, res) => {
                res.send(generateHTML(url.url, url.description));
            });
        });
    }
    loadUrls();
    fs.watchFile(filePath, (curr, prev) => {
        loadUrls();
    });
}

module.exports = {loadUrl};