<template>
  <nuxt-link v-if="path" :to="localePath(path)">
    <v-avatar :color="color" v-bind="$attrs">
      <img v-if="url" :src="url" alt="Avatar" />
      <span v-else class="white--text title">{{ initials }}</span>
    </v-avatar>
  </nuxt-link>

  <v-avatar v-else :color="color" v-bind="$attrs">
    <img v-if="url" :src="url" alt="Avatar" />
    <span v-else class="white--text title">{{ initials }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { RawLocation } from 'vue-router';

import User from '@/models/User';
import { colorFromText } from '@/utils/text';

@Component({})
export default class Avatar extends Vue {
  @Prop() link?: RawLocation | boolean;
  @Prop() title?: string;
  @Prop() src?: string;
  @Prop() user?: User;

  get color(): string {
    return this.url ? 'transparent' : colorFromText(this.initials);
  }

  get initials(): string {
    const title = this.user?.username || this.title;

    return title ? title.substr(0, 2) : '??';
  }

  get path(): RawLocation | undefined {
    if (this.link === true) {
      return this.user?.path;
    }

    return this.link || undefined;
  }

  get url(): string | undefined {
    return this.user?.avatar || this.src;
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
