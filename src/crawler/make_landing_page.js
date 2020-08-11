const fs = require("fs");
const favicons = require("favicons");
const { config } = require("../../config");
const path = require("path");
const { join } = require("path");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const trianglify = require("trianglify");
const { copySync, ensureDirSync } = require("fs-extra");
const { JSDOM } = require("jsdom");
const pretty = require("pretty");

async function makeLandingPage() {
  logTitle("Generate Landing Page");
  makeLandingPageBackground();

  /* Create the HTML dom object */
  const templateHTML = fs.readFileSync(
    path.join("src", "client", "index.html"),
    { encoding: "utf-8" }
  );

  const faviconsData = await makeFavicons();

  let dom = new JSDOM(templateHTML);
  let head = dom.window.document.createElement("div");
  head.innerHTML = faviconsData.html;

  dom.window.document.head.appendChild(head);

  const prettyHTML = pretty(dom.serialize());
  fs.writeFileSync(path.join(config.BUILD_FOLDER, "index.html"), prettyHTML);
}

module.exports.makeLandingPage = makeLandingPage;
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

/**
 *  Generates icons locally using pure Javascript with no external dependencies.
 * @returns object with 'files' 'images' 'html' arrays.
 */
async function makeFavicons() {
  const source = config.PROJECT_LOGO; // Source image(s). `string`, `buffer` or array of `string`
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
    start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
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
  const cacheImgPath = path.join(cachePath, "favicons");
  const cacheHeadPath = path.join(cachePath, "faviconsData.json");
  try {
    if (
      !fs.existsSync(cachePath) ||
      !fs.existsSync(".cache/favicons/manifest.json")
    ) {
      logBg("Building favicons cache");
      const faviconsData = await favicons(source, configuration);

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

  /* Copy the favicons cache to the build folder */
  copySync(cachePath, config.BUILD_FOLDER, {
    recursive: true,
  });

  // Get the JSON data from cache to return it.
  const faviconsData = JSON.parse(
    fs.readFileSync(cacheHeadPath, { encoding: "utf-8" })
  );

  logOK(`Favicons copied.`);
  return faviconsData;
}
