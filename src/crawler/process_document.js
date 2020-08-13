const { readFileSync } = require("fs-extra");
const Mustache = require("mustache");
const matter = require("gray-matter");
const { config } = require("../../config");
var md = require("markdown-it")();

/**
 * Given a filepath it will return a document with markdown processed, metadata replaced, and converted to html
 *
 * @param {Filepath} path
 * @returns An object with: content, data, html properties.
 */
exports.processDocument = function (path) {
  const indexContentMD = readFileSync(path, { encoding: "utf-8" });

  /* Process Frontmatter */
  let document = matter(indexContentMD);

  /* Build the variables */
  document.data = { ...config, ...document.data };
  if (!document.data.title) {
    document.data.title = config.PROJECT_NAME;
  }
  if (!document.data.description) {
    document.data.description = config.PROJECT_DESCRIPTION;
  }

  /* Render Markdown */
  document.html = md.render(document.content);

  /* Process HTML to replace variables */
  document.html = Mustache.render(document.html, document.data);
  return document;
};
