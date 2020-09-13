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

const fs = require("fs");
const { config } = require("../../config");
const path = require("path");
const Mustache = require("mustache");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const trianglify = require("trianglify");
const { ensureDirSync, pathExistsSync } = require("fs-extra");
const { JSDOM } = require("jsdom");

const { processDocument } = require("./process_document");
const { parseExtraFiles } = require("./parse_extra_files");
const Jimp = require("jimp");

async function makeLandingPages() {
  logTitle("Generate Landing Pages");
  const extraFiles = parseExtraFiles();
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

    let dstPath = path.join(config.BUILD_FOLDER, lang.id, "index.html");

    const document = processDocument(indexPath, lang, extraFiles, dstPath);

    /* Concatenate with generated template */
    let template = fs.readFileSync(path.join(".temp", "landing_page.html"), {
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
  let dstPath = path.join(config.BUILD_FOLDER, "img", "bg.jpg");
  if (config.LANDING_PAGE_BG !== "auto") {
    try {
      fs.copyFileSync(config.LANDING_PAGE_BG, dstPath);
      logOK(`Background copied: ${config.LANDING_PAGE_BG} => ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  } else {
    const canvas = trianglify({
      width: 1200,
      height: 768,
      cellSize: getRandomInt(100, 250),
    }).toCanvas();

    try {
      const file = fs.createWriteStream(".temp/bg.png");
      canvas.createPNGStream().pipe(file);
      file.on("close", () => {
        //   Compress background
        Jimp.read(".temp/bg.png", function (err, image) {
          if (err) {
            console.log(err);
          } else {
            // image.resize(1200, 768);
            image.quality(80);
            image.write(dstPath);
          }
        });
      });
      logOK(`Generated background and copied into: ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  }
}
