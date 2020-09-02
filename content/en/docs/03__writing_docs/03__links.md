# Links

To create links relative to the language being used add a `//` at the start of the link. This will transform your link into a pseudo-absolute link

Assuming the site url is localhost and we are editing a src file located at `content/en/docs/about/test.md

> This only applies to `<a>` tags

```Markdown
[Relative](new-link) => will be converted to localhost/en/docs/about/test/new-link
[Absolute](/new-link) => will be converted to localhost/new-link
[Pseudo Absolute](//new-link) => will be converted to localhost/en/new-link
[Explicit Absolute](http://localhost/en/new-link) => will be kept intact.
```

## Examples

* [Relative](new-link)
* [Absolute](/new-link) 
* [Pseudo Absolute](//new-link) 
* [Explicit Absolute](http://localhost/en/new-link)
