// @flow
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import StaticRouter from 'react-router-dom/StaticRouter';

import AppShell from '../../src/components/AppShell';
import { routes } from '../../src/components/routes';
import store from '../../src/store';

export default (request, response, next) => {
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (error, html) => {
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
        const modules = [];
        let context   = {};
        const content = ReactDOMServer.renderToString(
          <Loadable.Capture report={m => modules.push(m)}>
            <Provider store={store}>
              <StaticRouter location={request.url} context={context}>
                <AppShell>
                  {renderRoutes(routes)}
                </AppShell>
              </StaticRouter>
            </Provider>
          </Loadable.Capture>
        );

        return response.send(html.replace('<div id="root"></div>', `<div id="root">${content}</div>`));
      })
      .catch(error => console.error(error));
  });
};
