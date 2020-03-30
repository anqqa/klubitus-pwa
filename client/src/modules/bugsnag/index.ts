import consola from 'consola';
import { resolve } from 'path';
import bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';

interface ModuleOptions {
  browserApiKey: string
  serverApiKey: string
}

export default function (options: ModuleOptions) {
  const logger = consola.withScope('Bugsnag');
  logger.info('Configuring');

  // @ts-ignore
  const bugsnagOptions = { ...this.options.bugsnag, ...options };

  logger.info('Adding browser plugin');

  // @ts-ignore
  this.addPlugin({
    src: resolve(__dirname, 'client.ts'),
    options: { apiKey: bugsnagOptions.browserApiKey },
    ssr: false
  });

  const bugsnagClient = bugsnag({ apiKey: bugsnagOptions.serverApiKey, logger });
  bugsnagClient.use(bugsnagExpress);

  logger.info('Adding server handlers');
  // @ts-ignore
  this.nuxt.hook('render:setupMiddleware', app => app.use(bugsnagClient.getPlugin('express').requestHandler));
  // @ts-ignore
  this.nuxt.hook('render:errorMiddleware', app => app.use(bugsnagClient.getPlugin('express').errorHandler));
  // @ts-ignore
  this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
    errors.forEach(({ error }) => bugsnagClient.notify(error, { metaData: { route } }));
  })
}
