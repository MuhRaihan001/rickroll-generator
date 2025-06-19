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
    <meta name="description" content="${description}" />
    <style>
      .progress-bar {
        width: 100%;
        height: 6px;
        background-color: #333;
        overflow: hidden;
        border-radius: 4px;
        margin-top: 1rem;
      }
      .progress-bar > div {
        height: 100%;
        background-color: #3b82f6;
        animation: loading 1.5s linear forwards;
      }
      @keyframes loading {
        from { width: 0%; }
        to { width: 100%; }
      }
    </style>
  </head>
  <body class="bg-gray-950 text-white flex items-center justify-center min-h-screen px-4">
    <main class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full text-center shadow-xl">
      <h1 class="text-2xl sm:text-3xl font-bold mb-3">${name}</h1>
      <p class="text-base sm:text-lg mb-1">${description}</p>

      <!-- Preparing & Countdown -->
      <div id="loaderSection">
        <p class="text-sm text-gray-300">Preparing...</p>
        <div class="progress-bar"><div></div></div>
      </div>

      <div id="countdownSection" class="hidden mt-4">
        <p class="text-sm text-gray-400">
          Redirecting in <span id="countdown" class="font-semibold text-white">3</span> seconds...
        </p>
        <p class="text-xs text-gray-500 mt-1">
          If you are not redirected automatically,
          <a href="https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" class="text-blue-500 hover:underline">click here</a>.
        </p>
      </div>
    </main>

    <script>
      // Delay before showing countdown
      setTimeout(() => {
        document.getElementById("loaderSection").classList.add("hidden");
        document.getElementById("countdownSection").classList.remove("hidden");

        // Start countdown
        let seconds = 3;
        const countdownEl = document.getElementById('countdown');
        const interval = setInterval(() => {
          seconds--;
          countdownEl.textContent = seconds;
          if (seconds <= 0) clearInterval(interval);
        }, 1000);
      }, 1500); // 1.5s loading bar duration
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