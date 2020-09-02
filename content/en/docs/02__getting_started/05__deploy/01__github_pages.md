---
title:  Deploy Docurry site to Github pages using Github actions.
description: Deploy Docurry site to Github pages using Github actions
---

# Deploy Docurry site to Github pages using Github actions

There is a ready to use github action at `.github/workflows/build-and-deploy-site.yml` which will automatically deploy your site onto gh-pages branch on each commit to master. 

If you are not planning of using this feature it can be safely removed.

Some considerations:
- If you modified `BUILD_FOLDER` setting rename the src folder in there.
- If you are using custom domain use the cname property. Else remove it.


```YAML
# This workflow builds and deploys Docurry build folder into gh-pages branch.
name: Docurry Deploy

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: "12.x"
      - run: npm install
      - run: npm run build --if-present
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build # Change to match config.BUILD_FOLDER
          force_orphan: true
          cname: docurry.aboni.dev  # Remove if not using custom domains.
```