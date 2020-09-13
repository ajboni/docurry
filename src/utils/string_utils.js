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
const { readdirSync } = require("fs");
const { replaceAll, titleCase } = require("voca");

exports.removeFileExtension = function (str) {
  return str.replace(/\.[^/.]+$/, "");
};

exports.getFilenameFromPath = function (filepath, includeExtension = true) {
  if (!includeExtension) return path.basename(filepath, path.extname(filepath));
  else return path.basename(filepath);
};

exports.changeFileExtension = function (filepath, newExtension) {
  if (newExtension !== "") {
    newExtension = `.${newExtension}`;
  }
  return path.join(
    path.dirname(filepath),
    path.basename(filepath, path.extname(filepath)) + newExtension
  );
};

exports.getFolders = function (source) {
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

/**
 * Strip __ prefix and anything before that (used for sorting purposes) and return the clean name
 *
 * @param {string} str
 * @returns The string without the __prefix
 */
exports.removeSortingPrefix = function (str) {
  return replaceAll(str, /[^_\\\/]*__/, "");
};

/**
 * Generates a "nice" caption from a filePath.
 * Useful to show in sidebar or in the document html.
 *
 * @param {*} filePath
 * @returns
 */
exports.captionFromPath = function (filePath) {
  return replaceAll(
    titleCase(
      exports.removeSortingPrefix(exports.getFilenameFromPath(filePath, false))
    ),
    /[-_]/,
    " "
  );
};

/**
 *  Check if a string is a valid JSON string in JavaScript without
 * @param {string } str
 * @returns True/False if string is valid json
 */
exports.isValidJSON = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
