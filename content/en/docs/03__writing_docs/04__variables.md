# Variables to use in Markdown

You can use [mustache](https://github.com/janl/mustache.js) to access some of the data: the syntax is the variable enclosed in double curly braces `{ { var } }`.

1. All metadata from the frontmatter is available.
2. All settings of `config.js` are available
3. `ROOT` will point to the current language root url.

## Custom files

You can edit `EXTRA_FILES_AS_VARIABLES` in config to add markdown files that can be used as variables with the following syntax: `file_extension`.

For example: `README_md` Will output the contents of `readme.md` if exists. Useful for landing pages or doc index.
