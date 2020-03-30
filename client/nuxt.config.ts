import { Configuration } from '@nuxt/types';
// import nodeExternals from 'webpack-node-externals';

const isDev = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  dev: isDev,
  env: {
    API_URL: process.env.API_URL_BROWSER || 'http://localhost:3001',
    BASE_URL: process.env.CLIENT_HOST || 'http://localhost:3000',
    CDN_HOST: process.env.AWS_BUCKET || '',
    FB_APP_ID: process.env.FB_APP_ID || '',
    FB_CLIENT_TOKEN: process.env.FB_CLIENT_TOKEN || '',
  },

  server: {
    host: process.env.CLIENT_HOST ? '0.0.0.0' : 'localhost',
    port: process.env.CLIENT_PORT || 3000,
  },

  srcDir: 'src/',
  watchers: { webpack: { poll: true } },

  /**
   * Headers of the page
   */
  head: {
    // title: 'Klubitus',
    titleTemplate: title => `${title} | Klubitus`,
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Cairo:200,300,400,600,700,900&display=swap' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Lato:400,700|Montserrat:300,400,500&display=swap',
      },
    ],
  },
  meta: {
    description: 'Clubbers guide to... Finland',
  },
  css: ['@/assets/styles/klubitus.scss'],
  plugins: ['~/plugins/axios', '~/plugins/vue-plugins'],

  /**
   * Customize the progress bar color
   */
  loading: { color: '#ff3d99' },

  /**
   * Global modules
   */
  modules: [
    [
      'modules/bugsnag',
      {
        browserApiKey: process.env.BUGSNAG_CLIENT_API_KEY || '',
        serverApiKey: process.env.BUGSNAG_SERVER_API_KEY || ''
      },
    ],

    [
      '@nuxtjs/axios',
      {
        debug: isDev,
      },
    ],

    [
      '@nuxtjs/markdownit',
      {
        breaks: true,
        injected: true,
        linkify: true,
        typographer: true,
        use: [
          [
            'markdown-it-link-attributes',
            [
              {
                pattern: /^(https?:)?\/\/([\w.]*\.)?klubitus\.org/,
                attrs: {
                  class: 'internal-link',
                },
              },
              {
                attrs: {
                  class: 'external-link',
                  rel: 'noopener',
                  target: '_blank',
                },
              },
            ],
          ],
        ],
      },
    ],

    ['@nuxtjs/pwa', { icon: false }],

    [
      'nuxt-i18n',
      {
        defaultLocale: 'en',
        locales: [
          { code: 'en', iso: 'en-US', langFile: 'en.ts', name: 'English' },
          { code: 'fi', iso: 'fi-FI', langFile: 'fi.ts', name: 'suomi' },
        ],
        pages: {
          'events/index': { fi: '/tapahtumat' },
          'events/_id': { fi: '/tapahtumat/:id' },
          'events/_year/wk/_week/index': { fi: '/tapahtumat/:year/vk/:week' },
          'events/_year/_month/_day': { fi: '/tapahtumat/:year/:month/:day' },
          'events/_year/_month': { fi: '/tapahtumat/:year/:month' },

          'forum/topic/_id': { fi: '/forum/aihe/:id' },

          'galleries/index': { fi: '/kuvastot' },
          'galleries/events': { fi: '/kuvastot/tapahtumat' },
          'galleries/events/_year/_month/index': { fi: '/kuvastot/tapahtumat/:year/:month?' },
          'galleries/events/_year/_month/_day': { fi: '/kuvastot/tapahtumat/:year/:month?/:day?' },
          'galleries/flyers': { fi: '/kuvastot/flyerit' },
          'galleries/upload': { fi: '/kuvastot/upload' },
          'galleries/_id': { fi: '/kuvastot/:id' },

          'users/_id': { fi: '/kayttajat/:id' },
          'users/_id/favorites': { fi: '/kayttajat/:id/suosikit' },
          'users/_id/friends': { fi: '/kayttajat/:id/kaverit' },
          'users/_id/settings': { fi: '/kayttajat/:id/asetukset' },

          login: { fi: '/kirjaudu' },
          password: { fi: '/salasana' },
          signup: { fi: '/liity' },
        },
        parsePages: false,
        rootRedirect: 'en',
        seo: false,
        strategy: 'prefix',

        vueI18n: {
          fallbackLocale: 'en',
        },
      },
    ],
  ],

  buildModules: [
    [
      '@nuxt/typescript-build',
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true,
      },
    ],
    [
      '@nuxtjs/vuetify',
      {
        customVariables: ['~/assets/styles/variables.scss'],
        defaultAssets: { font: false },
        optionsPath: '~/plugins/vuetify.options.ts',
        treeShake: true,
      },
    ],
  ],

  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active-exact',
  },

  /**
   * PWA
   */
  manifest: {
    background_color: '#212121',
    name: 'Klubitus',
    short_name: 'Klubitus',
  },

  /**
   * Build configuration
   */
  build: {
    /**
     * Run ESLint on save
     */
    extend(conf, ctx) {
      if (ctx.isClient && isDev) {
        conf.devtool = 'source-map';
      }
    },
    // extend (config, ctx) {
    // if (ctx.isDev && ctx.isClient) {
    //   config.module.rules.push({
    //     enforce: 'pre',
    //     test:    /\.(js|vue)$/,
    //     loader:  'eslint-loader',
    //     exclude: /(node_modules)/
    //   });
    // }

    // if (ctx.isServer) {
    //   config.externals = [
    //     nodeExternals({
    //       whitelist: [/\.css$/]
    //     })
    //   ]
    // }
    // },

    // analyze: true,
    extractCSS: true,
    // parallel: true,
    terser: true,

    postcss: {
      preset: {
        features: { customProperties: false },
      },
    },
  },

  vue: {
    config: {
      productionTip: true,
    },
  },
};

export default config;
