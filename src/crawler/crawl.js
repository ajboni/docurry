const path = require("path");
const { config } = require("../../config");
const { mkdirSync, rmdirSync, writeFileSync } = require("fs-extra");
const { copyMedia } = require("./copy_media");
const { makeLandingPage } = require("./make_landing_page");
const { logTitle } = require("../utils/log");
const { timeElpasedInSeconds } = require("../utils/date_utils");
const { makeStyles } = require("./make_styles");
const { ensureDirSync } = require("fs-extra");
const { BUILD_FOLDER } = config;

exports.crawl = function () {
  /* Clean Up */
  const startTime = new Date();
  rmdirSync(BUILD_FOLDER, { recursive: true });
  mkdirSync(BUILD_FOLDER);

  /* Create necesary folders */
  ensureDirSync(path.join(config.BUILD_FOLDER, "css"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "js"));

  /* Copy Media Files */
  copyMedia();

  /* Generate Styles */
  makeStyles();

  /* Process Landing Page*/
  makeLandingPage();

  /* Generate Sidebar */

  /* Process Footer*/
  /* Process Documents */
  /* Process Sidebar */

  /* Build Completed */
  const elapsed = timeElpasedInSeconds(startTime, new Date());
  logTitle(`Building Done in ${elapsed} seconds.`);
  writeFileSync(
    path.join(BUILD_FOLDER, ".build.log"),
    new Date().toISOString()
  );
};
