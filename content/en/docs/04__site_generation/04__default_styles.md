## Default Styles

To customize branding colors set variables in `src/client/scss/_variables.scss`

To customize how the website look, you can modify `src/client/scss/landing_page.scss`. and `src/client/scss/docs.scss`
Docurry uses [spectre](https://picturepan2.github.io/spectre/getting-started/custom.html). Follow the link for more info about customizing it.

Full list of variables can be found [here](https://github.com/picturepan2/spectre/blob/master/src/_variables.scss)

## Adding styles

Any `.scss` file you add in `src/client/scss` will be processed and copied into `BUILD_FOLDER/css`
Any style that starts with underscore `_` will be ignored.
