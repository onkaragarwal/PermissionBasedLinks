## button-quick-links

This webpart shows button based links based on permission. The concept is similar to existing quick links webparts but this is based on permission and is restriced to only button based layout.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

After build create the package by running below commands

```bash
git bundle --ship
gulp package-solution --ship
```

Deploy the solution to appcatalog
