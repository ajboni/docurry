exports.config = {
  /* Project Name and logo on the navbar. */
  PROJECT_NAME: "Docurry",
  PROJECT_DESCRIPTION: "A spicy, zero-config documentation site generator.",

  /* Folder where src docs are located. */
  CONTENT_FOLDER: "./content",

  /* Images, relative to CONTENT_FOLDER  */
  PROJECT_LOGO: "img/logo.png",

  /*   Folder where built files will be located. */
  BUILD_FOLDER: "./build",

  /*  ID for the default language. It will be accesible without any prefix in the slug. */
  DEFAULT_LANGUAGE_ID: "en",

  /* Available languages 
  First language will be the default language. Landing page will be accesible without any prefix in the slug.
  If there is only one langugage, the entire site will be accesed without language path in the url.
  id is: ISO 3166-1-alpha-2 code
  */

  LANGUAGES: [
    { id: "en", caption: "English", iso: "gb" },
    { id: "es", caption: "Español", iso: "es" },
  ],

  /* Include a language selector on landing page and docs */
  ADD_LANGUAGE_SELECTOR: true,

  /* Should we show the default language doc if the localized version cannot be found ? */
  FALLBACK_TO_DEFAULT_LANGUAGE: true,

  /* Enable site-wide searching */
  ENABLE_SEARCH: true,

  /* Autogenerate sidebar content for documents */
  AUTO_GENERATE_SIDEBAR: true,

  /* Add Table Of contents widget on doc page.*/
  ADD_TOC: false,

  /* If 'auto', autogenerate background options using trianglify (checkout the license) otherwise specify path for image */
  LANDING_PAGE_BG: "auto",

  /* File contents of this list will be available for use as a variable in a template or markdown as {{filepath_extension}} */
  EXTRA_FILES_AS_VARIABLES: ["README.md", "config.js"],

  /* Whether to strip .html extension in generated links (sidebar) (eg: /en/docs/tutorial.html => /en/docs/tutorial ) */
  REMOVE_EXTENSION_FROM_LINKS: false,
};
