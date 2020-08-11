const { config } = require("../../config");
const path = require("path");
const { join } = require("path");
const { logTitle, logOK, logError } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const trianglify = require("trianglify");
const fs = require("fs");

exports.makeLandingPage = function () {
  logTitle("Generate Landing Page");
  makeLandingPageBackground();
};

/**
 * Generates a background from scratch using trianglify or gets the bg defined in settings.
 * In either case a bg.png file is created in build/media/img
 */
function makeLandingPageBackground() {
  let dstPath = path.join(config.BUILD_FOLDER, "media", "img", "bg.png");
  if (config.LANDING_PAGE_BG !== "auto") {
    try {
      fs.copyFileSync(config.LANDING_PAGE_BG, dstPath);
      logOK(`Background copied: ${config.LANDING_PAGE_BG} => ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  } else {
    const canvas = trianglify({
      width: 1920,
      height: 1080,
      cellSize: getRandomInt(75, 300),
    }).toCanvas();

    try {
      const file = fs.createWriteStream(dstPath);
      canvas.createPNGStream().pipe(file);
      logOK(`Generated background and copied into: ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  }
}
