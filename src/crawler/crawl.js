const path = require("path");
const { config } = require("../../config");
const { mkdirSync, rmdirSync, writeFileSync } = require("fs-extra");
const { copyMedia } = require("./copy_media");
const { makeLandingPage } = require("./make_landing_page");
const { logTitle } = require("../utils/log");
const { timeElpasedInSeconds } = require("../utils/date_utils");
const { BUILD_FOLDER } = config;

exports.crawl = function () {
  /* Clean Up */
  const startTime = new Date();
  rmdirSync(BUILD_FOLDER, { recursive: true });
  mkdirSync(BUILD_FOLDER);

  /* Copy Media Files */
  copyMedia();

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
