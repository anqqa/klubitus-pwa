<template>
  <nuxt-link v-if="link" :to="localePath(link)">
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
  @Prop() link!: RawLocation;
  @Prop() title!: string;
  @Prop() src!: string;
  @Prop() user!: User;

  get color(): string {
    return this.url
      ? 'transparent'
      : colorFromText(this.title || (this.user && this.user.username) || '');
  }

  get initials(): string {
    const title = this.title || (this.user && this.user.username);

    return title ? title.substr(0, 2) : '??';
  }

  get url(): string | undefined {
    return this.src || (this.user && this.user.avatar);
  }
}
</script>
