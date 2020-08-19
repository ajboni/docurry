const path = require("path");
const { config } = require("../../config");
const { mkdirSync, rmdirSync, writeFileSync } = require("fs-extra");
const { copyMedia } = require("./copy_media");
const { makeLandingPages } = require("./make_landing_pages");
const { logTitle } = require("../utils/log");
const { timeElpasedInSeconds } = require("../utils/date_utils");
const { makeStyles } = require("./make_styles");
const { ensureDirSync } = require("fs-extra");
const { initBuildFolder } = require("./init_build_folder");
const { makeTemplates } = require("./make_templates");
const { makeDocPages } = require("./make_docs_pages");
const { BUILD_FOLDER } = config;

async function crawl() {
  const startTime = new Date();

  /* Clean Up */
  initBuildFolder();

  /* Copy Media Files */
  copyMedia();

  /* Generate Styles */
  makeStyles();

  /* Generate basic templates */
  await makeTemplates();

  /* Process Landing Pages */
  makeLandingPages();

  /* Generate Sidebar */

  /* Process Footer*/
  /* Process Documents */
  await makeDocPages();
  /* Process Sidebar */

  /* Build Completed */
  const elapsed = timeElpasedInSeconds(startTime, new Date());
  logTitle(`Building Done in ${elapsed} seconds.`);
  writeFileSync(
    path.join(BUILD_FOLDER, ".build.log"),
    new Date().toISOString()
  );
}

module.exports.crawl = crawl;
