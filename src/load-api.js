const fs = require("fs");
const path = require("path");

function warningLog(msg) {
    console.warn(`[WARNING] ${msg}`);
}

function logError(msg, err) {
    console.error(`[ERROR] ${msg}`);
    if (err) console.error(err);
}

function logRouteLoad(tag, msg) {
    console.log(`[${tag.toUpperCase()}] ${msg}`);
}

function getFilesRecursively(dir) {
    let results = [];
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(fullPath));
        } else if (entry.endsWith(".js")) {
            results.push(fullPath);
        }
    }

    return results;
}

async function loadAPIs(app) {
    const api_folder = "../API";
    if (!api_folder) return warningLog("API_FILE environment variable not found");

    const routeDir = path.join(__dirname, api_folder);
    if (!fs.existsSync(routeDir)) return warningLog(`API directory not found: ${routeDir}`);

    const routeFiles = getFilesRecursively(routeDir);
    if (routeFiles.length === 0) return warningLog(`No API files found in directory: ${routeDir}`);

    console.log("Initiate API route loading...");

    for (const routePath of routeFiles) {
        const relativePath = path.relative(routeDir, routePath).replace(/\\/g, "/");
        const routeBasePath = `/api/${relativePath.replace(/\.js$/, '')}`;

        try {
            const routeModule = require(routePath);
            if (!routeModule || typeof routeModule !== "function") {
                warningLog(`Route export must be a function: ${routePath}`);
                continue;
            }

            app.use(routeBasePath, routeModule);
            console.log(`✅ | API : ${routeBasePath} Loaded`);
            logRouteLoad("api_load", `Route file loaded: ${routePath}`);
        } catch (err) {
            logError(`Failed to load route file: ${routePath}`, err);
        }
    }
}

module.exports = { loadAPIs };
