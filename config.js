exports.config = {
  /* Project Name and logo on the navbar. */
  PROJECT_NAME: "Docurry",
  PROJECT_DESCRIPTION: "A spicy documentation site generator.",

  /* Folder where src docs are located. */
  CONTENT_FOLDER: "./content",

  /* Images, relative to CONTENT_FOLDER  */
  PROJECT_LOGO: "img/logo.png",
  FAVICON: "img/logo.png",

  /*   Folder where built files will be located. */
  BUILD_FOLDER: "./build",

  /*  ID for the default language. It will be accesible without any prefix in the slug. */
  DEFAULT_LANGUAGE_ID: "en",

  /* Available languages 
  First language will be the default language. It will be accesible without any prefix in the slug.*/
  LANGUAGES: [
    { id: "en", caption: "English" },
    { id: "es", caption: "Español" },
  ],

  /* Should we show the default language doc if the localized version cannot be found ? */
  FALLBACK_TO_DEFAULT_LANGUAGE: true,

  /* Debug section */
  DEBUG_PRINT_GENERATED_SITEMAP: true,
  DEBUG_PRINT_CRAWLED_FILES: true,

  /* Autogenerate sidebar content for documents */
  AUTO_GENERATE_SIDEBAR: true,

  /* If 'auto', autogenerate background options using trianglify (checkout the license) otherwise specify path for image */
  LANDING_PAGE_BG: "auto",
};
