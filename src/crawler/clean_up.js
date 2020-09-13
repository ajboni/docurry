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

const { logTitle, logStatus, logOK } = require("../utils/log");
const path = require("path");
const { PurgeCSS } = require("purgecss");
const { config } = require("../../config");
const { writeFileSync } = require("fs-extra");

async function cleanUp() {
  logTitle("Clean up");

  /* Purge CSS */
  if (config.PURGE_CSS.purge) {
    const purgeCSSResult = await new PurgeCSS().purge({
      content: [`${config.BUILD_FOLDER}/**/*.html`],
      css: [`${config.BUILD_FOLDER}/css/**/*.css`],
      rejected: true,
      whitelist: config.PURGE_CSS.whitelist,
      whitelistPatterns: config.whitelistPatterns,
      whitelistPatternsChildren: config.whitelistPatternsChildren,
    });

    purgeCSSResult.forEach((x) => {
      writeFileSync(x.file, x.css);
      logOK(`Purged ${x.rejected.length} unused selectors from ${x.file}`);
    });
  }
}

exports.cleanUp = cleanUp;
