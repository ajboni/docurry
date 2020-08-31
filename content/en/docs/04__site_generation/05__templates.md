# Templates

Several html templates can be found in `src/client` folder

`docs.html` This is the document article template
`landing_page.html` The landing page of the site
`sidebar.html` The sidebar template.
`sidebar.html` Each sidebar item template.
`navbar.html` Navbar template

## Sidebar
In order to generate the sidebar Docurry will do the following:

1. It will look for a `sidebar.json` file inside each language content folder:

Example
```json
[
  {
    "name": "github",
    "caption": "Github",
    "path": "https://github.com",
    "isFolder": false,
    "parent": "docs",
    "children": []
  }
]

```

Nested menus can be manually built.


2. If `AUTO_GENERATE_SIDEBAR` setting is true will append to that file each document path and will create the appropriate hierarchy of files/folders.

![sidebar-example](/img/sidebar-example.jpg)

## Navbar

Navbar can have a search box and buttons.

To enable search box just set `ENABLE_SEARCH` setting.
Similar to [manual sidebar](#sidebar) you can provide a `navbar.json` with the following content:

```json
[
  {
    "caption": "Github",
    "url": "https://github.com",
    "class": "btn-primary"
  }
]
```

The result will be something like this:

![Navbar](/img/navbar-example.jpg)
