<template>
  <button v-if="isSdkReady" class="button fb is-full" @click="onClick">
    <i class="bx bxl-facebook-square" />
    <span v-if="name">Continue as {{ name }}</span>
    <span v-else>Login with Facebook</span>
  </button>
  <button v-else class="button fb is-full" disabled>
    <i class="bx bx-loader-alt bx-spin" /> Preparing Facebook...
  </button>
</template>

<script>
export default {
  name: 'FBLogin',

  props: {
    params: { default: () => {}, type: Object },
  },

  data() {
    return {
      isSdkReady: false,
      name: null,
      token: null,
    };
  },

  computed: {
    isConnected() {
      return !!this.token;
    },
  },

  watch: {
    async isConnected(connected) {
      if (connected) {
        this.$emit('connected');

        const response = await this.getMe('name');

        this.name = response.name;
      }
    },
  },

  async mounted() {
    try {
      await this.initFbSdk();
      this.isSdkReady = true;

      const response = await this.getStatus();
      console.log('getStatus', response);
      if (response.status === 'connected') {
        this.token = response.authResponse.accessToken;
      }
    } catch (error) {
      console.warn(error);
    }
  },

  methods: {
    async getMe(fields = 'id') {
      return new Promise(resolve => {
        window.FB.api(`/me?fields=${fields}`, response => resolve(response));
      });
    },

    async getStatus() {
      return new Promise(resolve => {
        window.FB.getLoginStatus(response => resolve(response));
      });
    },

    async initFbSdk() {
      return new Promise(resolve => {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId: process.env.FB_APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v3.2',
          });

          resolve();
        };

        ((d, s, id) => {
          if (d.getElementById(id)) {
            resolve();

            return;
          }

          const fjs = d.getElementsByTagName(s)[0];
          const js = d.createElement('script');
          js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      });
    },

    async login(options) {
      return new Promise(resolve => {
        window.FB.login(response => resolve(response), options);
      });
    },

    async onClick(event) {
      event.preventDefault();

      const response = await this.login(this.params);
      if (response.status === 'connected') {
        this.token = response.authResponse.accessToken;
      }

      this.$emit(response.authResponse ? 'success' : 'error', response);
    },
  },
};
</script>
