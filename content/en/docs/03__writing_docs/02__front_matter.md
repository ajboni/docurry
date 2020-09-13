# Front Matter

Any file that contains a YAML front matter block will be processed by Docurry as a special file. The front matter must be the first thing in the file and must take the form of valid YAML set between triple-dashed lines. Here is a basic example:

```YAML
---
title: My Awesome Site
description: Some not generic description.
caption: Sidebar friendly name
url: http://override_url
external: true
---
```

Between these triple-dashed lines, you can set predefined variables (see below for a reference) or even create custom ones of your own. These variables will then be available for you to access using [mustache](variables.html) both further down in the file and also in any layouts or includes that the page or post in question relies on.

- `title` and `description` tags will be added to the HTML as meta tags, they are useful for SEO purposes.
- `caption` Will be used for the sidebar. If no caption tag is set, docurry will auto generate one with the file name.
- `url` If set, the url on the sidebar and search, will link to it.
- `external` If `true` will open link in a new tab and it will add `rel="noopener noreferrer"` to the `<a>` tag
