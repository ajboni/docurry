const { crawl } = require("./src/crawler/crawl");
const chokidar = require("chokidar");
const { copyMedia } = require("./src/crawler/copy_media");
const { config } = require("./config");
const { makeStyles } = require("./src/crawler/make_styles");
const path = require("path");
const { copyTemplatesJavascript } = require("./src/crawler/init_build_folder");
/* Set up dev live-reload */
crawl();
setUpLiveReload();

/**
 * Sets up live reload for dev environment.
 * TODO: Make it more modular. do not clean up. remove and only reprocess what's changed.
 */
function setUpLiveReload() {
  if (process.env.NODE_ENV === "development") {
    // TODO:
    // chokidar
    //   .watch("./src", { ignoreInitial: true })
    //   .on("all", (event, path) => {
    //     crawl();
    //     console.log(event, path);
    //   });

    // /* Watch CSS Folder */
    // chokidar
    //   .watch(path.join("src", "client", "scss"), { ignoreInitial: true })
    //   .on("all", (event, path) => {});

    chokidar
      .watch("./config.js", { ignoreInitial: true })
      .on("all", (event, path) => {
        crawl();
        console.log(event, path);
      });

    chokidar
      .watch(config.CONTENT_FOLDER, { ignoreInitial: true })
      .on("all", (event, path) => {
        console.log(event, path);
        crawl();
      });

    /* Watch client files */
    chokidar
      .watch(path.join("src", "client"), { ignoreInitial: true })
      .on("all", (event, _path, details) => {
        console.log(path.extname(_path));
        switch (path.extname(_path)) {
          case ".js":
            copyTemplatesJavascript();
            break;
          case ".scss":
            makeStyles();
            break;
          default:
            break;
        }
      });
  }
}
