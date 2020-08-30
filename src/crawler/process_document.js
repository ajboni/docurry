const { readFileSync } = require("fs-extra");
const path = require("path");
const Mustache = require("mustache");
const matter = require("gray-matter");
const { config } = require("../../config");
const {
  getFilenameFromPath,
  removeSortingPrefix,
  captionFromPath,
} = require("../utils/string_utils");
const { JSDOM } = require("jsdom");
var v = require("voca");

const hljs = require("highlight.js");

var md = require("markdown-it")({
  html: true,
  linkify: false,
  // Actual default values
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code data-lang="${lang}">${
          hljs.highlight(lang, str, true).value
        }</code></pre>`;
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
  //   typography: true,
})
  .use(require("markdown-it-imsize"), { autofill: true })
  .use(require("markdown-it-anchor"), {
    permalink: true,
    // permalinkSymbol: "🔗",
    // permalinkSpace: true,
    permalinkBefore: true,
  })
  .use(require("markdown-it-external-links"), {
    externalClassName: null,
    externalRel: "noopener noreferrer",
    externalTarget: "_blank",
  })
  .use(require("markdown-it-task-lists"), {
    label: true,
  });

/**
 * Given a filepath it will return a document with markdown processed, metadata replaced, and converted to html
 *
 * @param {Filepath} filePath
 * @returns An object with: content, data, html properties.
 */
exports.processDocument = function (filePath, lang, extraFiles = {}) {
  const fallbackTitle = captionFromPath(filePath);
  const indexContentMD = readFileSync(filePath, { encoding: "utf-8" });

  /* Process Frontmatter */
  let document = matter(indexContentMD);

  /* Process Extra Files */
  if (extraFiles)
    document.content = Mustache.render(document.content, extraFiles);

  /* Render Markdown */
  document.html = md.render(document.content);

  /* Build the variables */
  document.data = {
    ...config,
    ...document.data,
    ROOT: `${lang.id}/docs/`,
  };

  if (!document.data.title) document.data.title = fallbackTitle;

  if (!document.data.description)
    document.data.description = config.PROJECT_DESCRIPTION;

  /* On Landing pages we will format the title differently */
  landingPagePath = path.join(config.CONTENT_FOLDER, lang.id, "index.md");
  if (filePath === landingPagePath) {
    document.data.title = `${document.data.title} · ${document.data.description}`;
  } else {
    document.data.title = `${document.data.title} · ${config.PROJECT_NAME}`;
  }
  /* Make relative links relative to current language */
  var dom = new JSDOM(document.html);
  const links = dom.window.document.getElementsByTagName("a");

  for (const link of links) {
    var relative = new RegExp("^(?:[a-z]+:)?///", "i");
    if (!relative.test(link.href)) {
      if (link.href.startsWith("//"))
        link.href = `/${lang.id}/${link
          .toString()
          .substr(2, link.toString().length)}`;
    }
  }

  /* Add language information to <code> tags */
  const blocks = dom.window.document.querySelectorAll("pre.hljs code");
  blocks.forEach((element) => {
    const lang = element.getAttribute("data-lang");
    const langElement = dom.window.document.createElement("label");
    langElement.innerHTML = lang;
    langElement.className = "language-caption";

    element.insertAdjacentElement("beforebegin", langElement);
  });

  document.html = dom.serialize();

  /* Process HTML to replace variables */
  document.html = Mustache.render(document.html, document.data);
  return document;
};
