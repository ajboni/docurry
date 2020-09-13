/**
 * Copyright (C) 2020 Alexis Boni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
