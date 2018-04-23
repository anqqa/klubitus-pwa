// @flow
import fs from 'fs';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import StaticRouter from 'react-router-dom/StaticRouter';

import manifest from '../../build/asset-manifest';
import AppFrame from '../../src/components/AppFrame';
import { routes } from '../../src/components/routes';
import theme from '../../src/components/theme';
import store from '../../src/store';


const extractAssets = (assets, chunks) => Object.keys(assets)
  .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
  .map(k => assets[k]);


export default (request, response, next) => {
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (error, htmlTemplate) => {
    if (error) {
      console.error('Error', error);

      return response.status(500).end;
    }

    const branch   = matchRoutes(routes, request.url);
    const promises = branch.map(({ route, match }) => {
      const fetchData = route.component.fetchData;

      return fetchData instanceof Function ? fetchData(store, match) : Promise.resolve(null);
    });

    return Promise
      .all(promises)
      .then(data => {

        // Material UI
        const generateClassName = createGenerateClassName();
        const sheetsManager     = new Map();
        const sheetsRegistry    = new SheetsRegistry();

        // SSR
        const modules = [];
        let context   = {};

        // Render HTML
        const html = renderToString(
          <Loadable.Capture report={m => modules.push(m)}>
            <Provider store={store}>
              <StaticRouter location={request.url} context={context}>
                <JssProvider generateClassName={generateClassName} registry={sheetsRegistry}>
                  <MuiThemeProvider sheetsManager={sheetsManager} theme={theme}>
                    <AppFrame>{renderRoutes(routes)}</AppFrame>
                  </MuiThemeProvider>
                </JssProvider>
              </StaticRouter>
            </Provider>
          </Loadable.Capture>
        );

        // Render JS
        const extraAssets = extractAssets(manifest, modules)
          .map(source => `<script type="text/javascript" src="/${source}"></script>`);

        // Render CSS
        const css = sheetsRegistry.toString();

        return response.send(htmlTemplate
          .replace(
            '<div id="root"></div>',
            `<div id="root">${html}</div><style id="jss-server-side">${css}</style>`
          )
          .replace(
            '</body>',
            extraAssets.join('') + '</body>'
          )
        );
      })
      .catch(error => console.error(error));
  });
};
