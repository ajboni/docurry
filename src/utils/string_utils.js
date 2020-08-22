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
