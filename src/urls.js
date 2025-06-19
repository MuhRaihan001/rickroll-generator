const fs = require('fs');
const path = require('path');

class UrlManager {
  constructor(app) {
    this.app = app;
    this.filePath = path.join(__dirname, '../custom_urls.json');
  }

  init() {
    this.loadUrls();
    fs.watchFile(this.filePath, () => this.loadUrls());
  }

  generateHTML(name, description) {
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
                .progress-bar { width: 100%; height: 6px; background-color: #333; overflow: hidden; border-radius: 4px; margin-top: 1rem; }
                .progress-bar > div { height: 100%; background-color: #3b82f6; animation: loading 1.5s linear forwards; }
                @keyframes loading { from { width: 0%; } to { width: 100%; } }
            </style>
        </head>
        <body class="bg-gray-950 text-white flex items-center justify-center min-h-screen px-4">
            <main class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full text-center shadow-xl">
                <h1 class="text-2xl sm:text-3xl font-bold mb-3">${name}</h1>
                <p class="text-base sm:text-lg mb-1">${description}</p>
                <div id="loaderSection">
                <p class="text-sm text-gray-300">Preparing...</p>
                <div class="progress-bar"><div></div></div>
                </div>
                <div id="countdownSection" class="hidden mt-4">
                <p class="text-sm text-gray-400">Redirecting in <span id="countdown" class="font-semibold text-white">3</span> seconds...</p>
                <p class="text-xs text-gray-500 mt-1">If you are not redirected automatically,
                    <a href="https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK" class="text-blue-500 hover:underline">click here</a>.
                </p>
                </div>
            </main>
            <script>
                setTimeout(() => {
                document.getElementById("loaderSection").classList.add("hidden");
                document.getElementById("countdownSection").classList.remove("hidden");
                let seconds = 3;
                const countdownEl = document.getElementById('countdown');
                const interval = setInterval(() => {
                    seconds--;
                    countdownEl.textContent = seconds;
                    if (seconds <= 0) clearInterval(interval);
                }, 1000);
                }, 1500);
            </script>
            <noscript><meta http-equiv="refresh" content="0; url=https://youtu.be/xvFZjo5PgG0?si=lML6mBBOYa7qPwEK"></noscript>
        </body>
    </html>`;
  }

  loadUrls() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const urls = JSON.parse(data);
      if (!Array.isArray(urls)) throw new Error("File is not in expected array format.");
      if (this.app._router && this.app._router.stack) {
        this.app._router.stack = this.app._router.stack.filter(layer => !layer.route);
      }
      urls.forEach(url => {
        this.app.get(`/${url.url}`, (req, res) => {
          res.send(this.generateHTML(url.url, url.description));
        });
      });
    } catch (error) {
      console.error("Failed to load URLs:", error);
    }
  }

  async addUrl(name, description) {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      let urls = JSON.parse(data);
      if (!Array.isArray(urls)) return { status: 404, message: "File is not in expected array format." };
      if (urls.some(u => u.url === name)) return { status: 409, message: "URL already exists." };
      if (!/^[a-zA-Z0-9-_]+$/.test(name)) return { status: 400, message: "Invalid characters in URL name." };

      const newUrl = { url: name, description };
      urls.push(newUrl);
      fs.writeFileSync(this.filePath, JSON.stringify(urls, null, 2));
      return { status: 200, message: "URL added successfully.", url: name };
    } catch (error) {
      console.error("Error adding URL:", error);
      return { status: 500, message: "Internal server error." };
    }
  }
}

module.exports = UrlManager;