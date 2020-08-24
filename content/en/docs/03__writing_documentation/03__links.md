# Links

To create links relative to the language being used add a `/` at the start of the link. This will transform your link into a pseudo-absolute link

Assuming the site url is docurry.com and we are editing a src file located at `content/en/docs/about/test.md

```Markdown
[New Link](new-link/) => will be converted to en/docs/about/test/new-link
[New Link](/new-link/) => will be converted to docurry.com/en/new-link
[New Link](docurry.com/en/new-link/) => will be kept intact.

```
