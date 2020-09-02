# Filename conventions

To facilitate sorting there are special rules that applies to file/folder naming

- Anything before `__` will be ignored: `01__Title.md` will become: `title.html` and `Title` on the sidebar (If title meta tag is not set). This is useful to sort directly on the file system.
- Underscores `_` and slashes will be converted to spaces in sidebar: `xxx__my_awesome_title` will become: `My Awesome Title` on the sidebar. (If title meta tag is not set).
