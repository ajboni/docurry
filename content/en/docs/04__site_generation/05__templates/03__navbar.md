## Navbar

Navbar can have a search box and buttons.

To enable search box just set `ENABLE_SEARCH` setting.
Similar to [manual sidebar](sidebar) you can provide a `navbar.json` with the following content:

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
