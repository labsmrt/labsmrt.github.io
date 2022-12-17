// You can use the package.json version or the date for cache busting
// isProd ? new Date().toISOString() : "dev";

const { version } = require("../../package.json");
const isProd = process.env.ELEVENTY_ENV === "prod";
const cacheHash = isProd ? version : "dev";

module.exports = {
    url: isProd ? "https://labsmrt.github.io/" : "http://localhost:8080",
    hash: "?=v" + cacheHash,
};
