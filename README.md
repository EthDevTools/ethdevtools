# ETH Dev Tools - Chrome Extension

This is a developer tools extension for Google Chrome. It adds a new "web3" panel that intercepts web3 to:
- log all web3 interactions
- explore contracts that have been loaded on the page

## Developing locally

run `npm run dev`

- go to `chrome://extensions`
- enable "developer mode"
- click "Load unpacked" and select the `dist` folder of this project

Live reloading will mostly handle things for you, but if you change the manifest, env vars, or webpack config, you will need to stop and restart `npm run dev`.

Also some specific errors may require going back to `chrome://extensions` and re-loading the plugin.


## Building for production

run `npm run build`


## Configuration

Configuration is stored in config/env.js and exposed in `process.env` via `webpack.DefinePlugin`. Defaults are loaded first and then overrides depending on the env being built for.

Optionally, you can create a `config/local.js` file (not checked into git) with overrides to be loaded only during local development.


### Credits

ETH Dev Tools was originally built as a hackathon project at [ETHDenver 2019](https://www.ethdenver.com/) by:

- Billy Rennekamp [(github @okwme)](https://github.com/okwme)
- Aidan Musnitsky [(github @musnit)](https://github.com/musnit)
- Theo Ephraim - [(github @theoephraim)](http://github.com/theoephraim)

A grant from [Consensys](https://consensys.net/) has helped drive further development

The basic development setup is based on Theo's [vue chrome extension template](https://github.com/theoephraim/vue-chrome-extension-template)