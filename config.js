export default config = {
  // Folder where src docs are located.
  SRC_DOCS_FOLDER: "./src/documents",

  // Folder where dist html docs will be located. Relative to ./Public
  DIST_DOCS_FOLDER: "./docs",

  // ID for the default language. It will be accesible without any prefix in the slug.
  DEFAULT_LANGUAGE_ID: "eng",

  // Available languages
  LANGUAGES: [
    { id: "eng", caption: "English" },
    { id: "spa", caption: "Spanish" },
  ],

  // Should we show the default language doc if the localized version cannot be found ?
  FALLBACK_TO_DEFAULT_LANGUAGE: true,

  // Debug section

  DEBUG_PRINT_GENERATED_SITEMAP: true,
  DEBUG_PRINT_CRAWLED_FILES: true,
};
