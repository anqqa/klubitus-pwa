// @flow
import express from 'express';
import Loadable from 'react-loadable';

import serverRenderer from './middleware/renderer';

const PORT = 3001;
const path = require('path');

// Initialize the app
const app    = express();
const router = express.Router();

// app.set('view engine', 'html');

// Root should serve the SSR page
router.use('^/$', serverRenderer);

// Static resources
router.use(express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' }));

// Catch-all for react-router
router.use('*', serverRenderer);

// Use our router
app.use(router);

// Start the app
Loadable.preloadAll().then(() => {
  app.listen(PORT, error => {
    if (error) {
      return console.log('Error', error);
    }

    console.log(`Listening on ${PORT}...`);
  });
});
