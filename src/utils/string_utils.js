const path = require("path");
exports.removeFileExtension = function (str) {
  return str.replace(/\.[^/.]+$/, "");
};

exports.getFilenameFromPath = function (filepath, includeExtension = true) {
  if (!includeExtension) return path.basename(filepath, path.extname(filepath));
  else return path.basename(filepath);
};

exports.changeFileExtension = function (filepath, newExtension) {
  return path.join(
    path.dirname(filepath),
    path.basename(filepath, path.extname(filepath)) + "." + newExtension
  );
};
