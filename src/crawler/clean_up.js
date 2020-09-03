const { logTitle, logStatus, logOK } = require("../utils/log");
const path = require("path");
const { PurgeCSS } = require("purgecss");
const { config } = require("../../config");
const { writeFileSync } = require("fs-extra");

async function cleanUp() {
  logTitle("Clean up");

  const purgeCSSResult = await new PurgeCSS().purge({
    content: [`${config.BUILD_FOLDER}/**/*.html`],
    css: [`${config.BUILD_FOLDER}/css/**/*.css`],
    rejected: true,
  });

  purgeCSSResult.forEach((x) => {
    writeFileSync(x.file, x.css);
    logOK(`Purged ${x.rejected.length} unused selectors from ${x.file}`);
  });
}

exports.cleanUp = cleanUp;
