const { readFileSync } = require("fs-extra");
const Mustache = require("mustache");
const matter = require("gray-matter");
const { config } = require("../../config");
const { getFilenameFromPath } = require("../utils/string_utils");
const { JSDOM } = require("jsdom");

var md = require("markdown-it")({
  html: true,
  //   linkify: true,
  //   typography: true,
}).use(require("markdown-it-imsize"), { autofill: true });

/**
 * Given a filepath it will return a document with markdown processed, metadata replaced, and converted to html
 *
 * @param {Filepath} path
 * @returns An object with: content, data, html properties.
 */
exports.processDocument = function (path, lang) {
  const fallbackTitle = getFilenameFromPath(path);
  const indexContentMD = readFileSync(path, { encoding: "utf-8" });

  /* Process Frontmatter */
  let document = matter(indexContentMD);

  /* Render Markdown */
  document.html = md.render(document.content);

  /* Build the variables */
  document.data = { ...config, ...document.data };
  if (!document.data.title) {
    document.data.title = fallbackTitle;
  }
  if (!document.data.description) {
    document.data.description = config.PROJECT_DESCRIPTION;
  }

  /* Make relative links relative to current language */
  var dom = new JSDOM(document.html);
  const links = dom.window.document.getElementsByTagName("a");

  for (const link of links) {
    var relative = new RegExp("^(?:[a-z]+:)?//", "i");
    if (!relative.test(link.href)) {
      if (link.href.startsWith("/"))
        link.href = `/${lang.id}/${link
          .toString()
          .substr(1, link.toString().length)}`;
    }
  }

  document.html = dom.serialize();

  /* Process HTML to replace variables */
  document.html = Mustache.render(document.html, document.data);
  return document;
};
