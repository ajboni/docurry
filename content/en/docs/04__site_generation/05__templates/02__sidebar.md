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

> To avoid dealing with manual sidebars, you can create a `.md` document and set its [url metadata](/en/docs/writing_docs/front_matter) to your desired link. (It will work with nested hierarchies also)

2. If `AUTO_GENERATE_SIDEBAR` setting is true will append to that file each document path and will create the appropriate hierarchy of files/folders.

![sidebar-example](/img/sidebar-example.jpg)
