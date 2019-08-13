<template>
  <v-btn v-if="isSdkReady" block color="facebook" @click="onClick">
    <v-icon>mdi-facebook-box</v-icon>
    <span v-if="name" class="d-inline-block text-truncate">Continue as {{ name }}</span>
    <span v-else>Login with Facebook</span>
  </v-btn>
  <v-btn v-else block color="facebook" disabled loading>
    Preparing Facebook...
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';

@Component({})
export default class FBLogin extends Vue {
  isSdkReady = false;
  name: string | null = null;
  token: string | null = null;

  @Prop() params!: object;

  initFbSdk(d, s, id) {
    if (d.getElementById(id)) {
      this.isSdkReady = true;

      return;
    }

    const fjs = d.getElementsByTagName(s)[0];
    const js = d.createElement('script');
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);

    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: process.env.FB_APP_ID || '',
        cookie: true,
        xfbml: false,
        version: 'v3.2',
      });

      this.isSdkReady = true;
    };
  }

  get isConnected(): boolean {
    return !!this.token;
  }

  onClick(event) {
    event.preventDefault();

    FB.login(response => {
      if (response.status === 'connected') {
        this.token = response.authResponse.accessToken;
      }

      this.$emit(response.authResponse ? 'success' : 'error', response);
    });
  }

  @Watch('isConnected')
  onConnectionChange(connected: boolean) {
    if (connected) {
      this.$emit('connected');

      FB.api(`/me?fields=name`, ({ name }) => {
        this.name = name;
      });
    }
  }

  mounted() {
    try {
      this.initFbSdk(document, 'script', 'facebook-jssdk');

      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          this.token = response.authResponse.accessToken;
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }
}
</script>
