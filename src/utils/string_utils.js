const path = require("path");
exports.removeFileExtension = function (str) {
  return str.replace(/\.[^/.]+$/, "");
};

exports.getFilenameFromPath = function (filepath, includeExtension = true) {
  if (!includeExtension) return path.basename(filepath, path.extname(filepath));
  else return path.basename(filepath);
};
