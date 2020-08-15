# Landing Page

Docurry will auto generate a landing page according to the info on README.md
To override the behavior simply create a index.md in your `content/{language}` folder: eg: `content/en/index.md`
Some special rules applies to this template:

- `<h5>` `#####` tags shows up big and centered, useful for showing emojis.
- Ordered lists `<ol>` shows up vertically stacked without list style.
- Unordered lists `<ul>` creates buttons for every entry and they are showed stacked horizontally. Intended to be used to create buttons with links.
- `<blockqoute>` `>` shows as a subtitle.

Example:

```Markdown
##### 🍛

# Docurry

> A spicy documentation site generator.

1. Simple and fast.
2. Statically built HTML. No router.
3. Multiple languages.
4. SEO and Mobile First
5. Open Source.

- [Docs](docs/)
- [Github](https://github.com/ajboni/docurry)

```
