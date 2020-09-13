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
const favicons = require("favicons");
const { config } = require("../../config");
const path = require("path");
const { logTitle, logOK, logError, logBg, logJob } = require("../utils/log");
const { copySync, ensureDirSync } = require("fs-extra");
const { JSDOM } = require("jsdom");
const pretty = require("pretty");

async function makeTemplates() {
  logTitle("Generate Base Templates");
  ensureDirSync(".temp");

  /* Base templates to be generated */
  const templates = [
    {
      name: "landing_page.html",
      path: path.join("src", "client", "landing_page.html"),
    },
    { name: "docs.html", path: path.join("src", "client", "docs.html") },
  ];

  /* Generates Favicons */
  const faviconsData = await makeFavicons();

  templates.forEach((template) => {
    const content = fs.readFileSync(template.path, { encoding: "utf-8" });
    let dom = new JSDOM(content);

    /* Add Favicon paths to html */
    dom.window.document.head.insertAdjacentHTML(
      "beforeend",
      faviconsData.html.join("")
    );
    const prettyHTML = pretty(dom.serialize());
    fs.writeFileSync(path.join(".temp", template.name), prettyHTML);
  });

  logOK(`Generated ${templates.length} templates.`);
}

module.exports.makeTemplates = makeTemplates;

/**
 *  Generates icons locally using pure Javascript with no external dependencies.
 * @returns object with 'files' 'images' 'html' arrays.
 */
async function makeFavicons() {
  const source = path.join(config.CONTENT_FOLDER, config.PROJECT_LOGO); // Source image(s). `string`, `buffer` or array of `string`
  const configuration = {
    path: "/favicons", // Path for overriding default icons path. `string`
    appName: config.PROJECT_NAME, // Your application's name. `string`
    appShortName: null, // Your application's short_name. `string`. Optional. If not set, appName will be used
    appDescription: config.PROJECT_DESCRIPTION, // Your application's description. `string`
    developerName: null, // Your (or your developer's) name. `string`
    developerURL: null, // Your (or your developer's) URL. `string`
    dir: "auto", // Primary text direction for name, short_name, and description
    lang: "en-US", // Primary language for name and short_name
    background: "#fff", // Background colour for flattened icons. `string`
    theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
    appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
    display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
    orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
    scope: "/", // set of URLs that the browser considers within your app
    start_url: "/", // Start URL when launching the application from a device. `string`
    version: "1.0", // Your application's version string. `string`
    logging: false, // Print logs to console? `boolean`
    pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
    loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
    icons: {
      // Platform Options:
      // - offset - offset in percentage
      // - background:
      //   * false - use default
      //   * true - force use default, e.g. set background for Android icons
      //   * color - set background for the specified icons
      //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
      //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
      //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
      //
      android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      windows: false, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      yandex: false, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    },
  };

  const cachePath = path.join(".cache", "favicons");
  const cacheImgPath = cachePath;

  //   const cacheImgPath = path.join(cachePath, "favicons");
  const cacheHeadPath = path.join(cachePath, "faviconsData.json");
  try {
    if (
      !fs.existsSync(cachePath) ||
      !fs.existsSync(".cache/favicons/manifest.json")
    ) {
      logJob("Building favicons cache");
      let faviconsData = await favicons(source, configuration);

      ensureDirSync(cachePath);
      ensureDirSync(path.join(cachePath, "favicons"));

      faviconsData.files.forEach((file) => {
        fs.writeFileSync(path.join(cachePath, file.name), file.contents);
      });

      faviconsData.images.forEach((img) => {
        fs.writeFileSync(path.join(cacheImgPath, img.name), img.contents);
      });

      let safeFaviconsData = faviconsData;
      safeFaviconsData = fs.writeFileSync(
        cacheHeadPath,
        JSON.stringify(faviconsData),
        {
          encoding: "utf-8",
        }
      );
      logOK(`Favicons Generated`);
    }
  } catch (error) {
    logError(error);
  }

  ensureDirSync(path.join(config.BUILD_FOLDER, "favicons"));

  /* Copy the favicons cache to the build folder */
  copySync(cachePath, path.join(config.BUILD_FOLDER, "favicons"), {
    recursive: true,
  });

  // Get the JSON data from cache to return it.
  const faviconsData = JSON.parse(
    fs.readFileSync(cacheHeadPath, { encoding: "utf-8" })
  );

  logOK(`Favicons copied.`);
  return faviconsData;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
