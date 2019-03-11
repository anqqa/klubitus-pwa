<template>
  <button v-if="isSdkReady" class="button is-full is-outlined" @click="onClick">
    <span class="icon"><i class="bx bxl-facebook"/></span>
    Login with Facebook
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
    };
  },

  mounted() {
    this.initFbSdk();
  },

  methods: {
    initFbSdk() {
      const installScript = (doc, id) => {
        if (doc.getElementById(id)) {
          this.isSdkReady = true;

          return;
        }

        const first = doc.getElementsByTagName('script')[0];
        const sdkJs = doc.createElement('script');
        sdkJs.id = id;
        sdkJs.src = 'https://connect.facebook.net/en_US/sdk.js';
        first.parentNode.insertBefore(sdkJs, first);
      };

      installScript(document, 'fb-sdk');

      window.fbAsyncInit = () => {
        FB.init({
          appId: process.env.FB_APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v3.2',
        });

        this.isSdkReady = true;
      };
    },

    onClick(event) {
      event.preventDefault();

      window.FB.login(response => {
        this.$emit(response.authResponse ? 'success' : 'error', response);
      }, this.params);
    },
  },
};
</script>

<style scoped></style>
