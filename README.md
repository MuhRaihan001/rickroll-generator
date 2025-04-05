# Rick Roll URL Generator 🎵

This is a simple URL generator project built using **Node.js** and **Express.js**, with support for dynamic routing, JSON-based URL storage, and HTML template rendering.

Originally made for fun, this project allows users to generate custom short links that redirect to a fixed destination after a countdown. For demonstration purposes, it redirects to the classic *Rick Astley - Never Gonna Give You Up* video on YouTube.

## 📁 Project Structure

- `app.js` – Main server entry using Express.
- `public/` – Contains frontend assets (HTML, CSS, video).
- `custom_urls.json` – Stores all generated custom URLs.
- `src/load-url.js` – Handles dynamic route generation from the JSON file.
- `src/add-url.js` – Adds new custom URLs to the list.

## ✨ Features

- Custom URL generation via POST API (`/add-url`)
- Realtime route loading using `fs.watchFile` on `custom_urls.json`
- Countdown-based redirection with animated UI
- Client-side form handling with fetch and Tailwind CSS
- Safe character validation and duplicate prevention

## 📦 Installation

```bash
git clone https://github.com/muhraihan001/rickroll-generator
cd rickroll-generator
npm install
node app.js
```