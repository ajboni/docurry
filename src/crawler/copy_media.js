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

const path = require("path");
const fse = require("fs-extra");
const { logOK, logTitle, logStatus } = require("../utils/log.js");
const { config } = require("../../config");
const columnify = require("columnify");

/**
 * Copies media content into build folder
 */
exports.copyMedia = () => {
  logTitle("Copy media resources.");
  const { BUILD_FOLDER, CONTENT_FOLDER } = config;
  const srcPath = path.join(CONTENT_FOLDER, "img");
  const dstPath = path.join(BUILD_FOLDER, "img");
  let filesCopied = [];
  const filterFunction = (src, dst) => {
    if (fse.lstatSync(src).isFile()) {
      const file = {
        source: src,
        destination: dst,
      };
      filesCopied.push(file);
    }
    return true;
  };

  //   console.log(columnify(new Array(filesCopied)));
  fse.ensureDirSync(dstPath);
  fse.copySync(srcPath, dstPath, { recursive: true, filter: filterFunction });
  logStatus(columnify(filesCopied) + "\n");

  logOK(`${filesCopied.length} files copied`);
};
