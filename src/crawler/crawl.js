const path = require("path");
const { config } = require("../../config");
const { mkdirSync, rmdirSync, writeFileSync } = require("fs-extra");
const { copyMedia } = require("./copy_media");
const { makeLandingPage } = require("./make_landing_page");
const { logTitle } = require("../utils/log");
const { timeElpasedInSeconds } = require("../utils/date_utils");
const { makeStyles } = require("./make_styles");
const { ensureDirSync } = require("fs-extra");
const { initBuildFolder } = require("./init_build_folder");
const { BUILD_FOLDER } = config;

exports.crawl = function () {
  const startTime = new Date();

  /* Clean Up */
  initBuildFolder();

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
