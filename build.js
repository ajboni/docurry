const { crawl } = require("./src/crawler/crawl");
const chokidar = require("chokidar");
const { copyMedia } = require("./src/crawler/copy_media");

/* Set up dev live-reload */
setUpLiveReload();
crawl();

/**
 * Sets up live reload for dev environment.
 * TODO: Make it more modular. do not clean up. remove and only reprocess what's changed.
 */
function setUpLiveReload() {
  if (process.env.NODE_ENV === "development") {
    // One-liner for current directory
    chokidar
      .watch("./src", { ignoreInitial: true })
      .on("all", (event, path) => {
        crawl();
        console.log(event, path);
      });

    chokidar
      .watch("./config.js", { ignoreInitial: true })
      .on("all", (event, path) => {
        crawl();
        console.log(event, path);
      });

    chokidar
      .watch("./content", { ignoreInitial: true })
      .on("all", (event, path) => {
        console.log(event, path);
        crawl();
      });
  }
}
