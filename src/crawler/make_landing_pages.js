const fs = require("fs");
const { config } = require("../../config");
const path = require("path");
const Mustache = require("mustache");
const { join } = require("path");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const trianglify = require("trianglify");
const { ensureDirSync, pathExistsSync } = require("fs-extra");
const { JSDOM } = require("jsdom");

const { processDocument } = require("./process_document");
const { title } = require("process");

async function makeLandingPages() {
  logTitle("Generate Landing Pages");
  makeLandingPageBackground();

  /* Process Markdown and write output */
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    ensureDirSync(path.join(config.BUILD_FOLDER, lang.id));
    let indexPath = path.join(config.CONTENT_FOLDER, lang.id, "index.md");

    /* Fallback for non existing languages */
    if (config.FALLBACK_TO_DEFAULT_LANGUAGE) {
      if (!pathExistsSync(indexPath)) {
        indexPath = path.join(config.CONTENT_FOLDER, langs[0].id, "index.md");
      }
    }

    const document = processDocument(indexPath, lang);

    let dstPath = path.join(config.BUILD_FOLDER, lang.id, "index.html");

    /* Concatenate with generated template */
    let template = fs.readFileSync(path.join(".temp", "_landing_page.html"), {
      encoding: "utf-8",
    });

    /* Replace variables in template */
    template = Mustache.render(template, config);

    let dom = new JSDOM(template);
    const el = dom.window.document.getElementById("cover-content");
    el.innerHTML = document.html;

    /* Set up metadata */
    dom.window.document.title = document.data.title;

    dom.window.document
      .querySelector('meta[name="description"]')
      .setAttribute("content", document.data.description);

    const processedHTML = dom.serialize();

    /* Finally write the file */
    fs.writeFileSync(dstPath, processedHTML, { encoding: "utf-8" });

    /* Default language get special treatment */
    if (index === 0) {
      /* TODO: Process links and make it relative to the lang folder. */

      fs.writeFileSync(
        path.join(config.BUILD_FOLDER, "index.html"),
        processedHTML,
        { encoding: "utf-8" }
      );
    }
  });
}

module.exports.makeLandingPages = makeLandingPages;

/**
 * Generates a background from scratch using trianglify or gets the bg defined in settings.
 * In either case a bg.png file is created in build/img
 */
function makeLandingPageBackground() {
  let dstPath = path.join(config.BUILD_FOLDER, "img", "bg.png");
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
