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
    {
      id: "en",
      caption: "English",
      iso: "gb",
      translations: {
        no_search_result: "No results found, try a different query.",
        table_of_contents: "Table of contents",
      },
    },
    {
      id: "es",
      caption: "Español",
      iso: "es",
      translations: {
        no_search_result:
          "No se han encontrado resultados. Pruebe otra búsqueda",
        table_of_contents: "Tabla de contenidos",
      },
    },
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
  ADD_TOC: true,

  /* Add Footer widget on doc page.*/
  ADD_FOOTER: true,

  /* Add 'NEXT' and 'PREVIOUS' buttons on each document.  */
  ADD_NEXT_PREVIOUS_BUTTONS: true,

  /* If 'auto', autogenerate background options using trianglify (checkout the license) otherwise specify path for image */
  LANDING_PAGE_BG: "auto",

  /* File contents of this list will be available for use as a variable in a template or markdown as {{filepath_extension}} */
  EXTRA_FILES_AS_VARIABLES: ["README.md", "config.js"],

  /* Whether to strip .html extension in generated links (sidebar) (eg: /en/docs/tutorial.html => /en/docs/tutorial ) */
  REMOVE_EXTENSION_FROM_LINKS: false,

  /* After build, remove any class that is not being used. Be careful with classes that inject at runtime.  
  You can add \/\* purgecss ignore \/\* directly on the class definition on your css or whitelist it below
  */
  PURGE_CSS: {
    purge: true,
    whitelist: null,
    whitelistPatterns: null,
    whitelistPatternsChildren: null,
  },
};
