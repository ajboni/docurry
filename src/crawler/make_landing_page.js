const { config } = require("../../config");
const path = require("path");
const { join } = require("path");
const { logTitle, logOK, logError } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const { ensureDirSync } = require("fs-extra");

exports.makeLandingPage = function () {
  logTitle("Generate Landing Page");

  /* Create necesary folders */
  ensureDirSync(path.join(config.BUILD_FOLDER, "css"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "js"));

  let backgroundPath;
  if (config.LANDING_PAGE_BG === "auto") {
    backgroundPath = makeLandingPageBackground();
  } else {
    backgroundPath = config.LANDING_PAGE_BG;
  }
};

function copyLandingPageBackground() {
  let dstPath = path.join(config.BUILD_FOLDER, "media", "img", "bg.png");
  try {
  } catch (error) {}
}

function makeLandingPageBackground() {
  let dstPath = path.join(config.BUILD_FOLDER, "media", "img", "bg.png");

  const trianglify = require("trianglify");
  const fs = require("fs");

  const canvas = trianglify({
    width: 1920,
    height: 1080,
    cellSize: getRandomInt(75, 300),
  }).toCanvas();

  try {
    const file = fs.createWriteStream(dstPath);
    canvas.createPNGStream().pipe(file);
    logOK(`[OK] Generated background and copied into: ${dstPath}`);
  } catch (error) {
    logError(error);
  }

  return dstPath;
}
