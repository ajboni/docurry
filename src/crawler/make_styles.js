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

var sass = require("node-sass");
const { config } = require("../../config");
const path = require("path");
const { logError, logOK, logTitle } = require("../utils/log");
const { writeFileSync } = require("fs");
var glob = require("glob");
const { getFilenameFromPath } = require("../utils/string_utils");

exports.makeStyles = function () {
  logTitle("Generating Styles");

  //   const srcPath = path.join("src", "client", "style.scss");
  //   const dstPath = path.join(config.BUILD_FOLDER, "css", "style.css");

  // options is optional
  const files = glob.sync("src/client/**/*.scss");
  try {
    files.forEach((srcPath) => {
      if (getFilenameFromPath(srcPath, false).startsWith("_")) return;
      const dstPath = path.join(
        config.BUILD_FOLDER,
        "css",
        `${getFilenameFromPath(srcPath, false)}.css`
      );
      const result = sass.renderSync({
        file: srcPath,
        outputStyle: "compressed",
      });
      writeFileSync(dstPath, result.css);
      logOK(`Convert sass styles into css: ${srcPath} => ${dstPath}`);
    });
  } catch (error) {
    logError(error);
  }
};
