<template>
  <v-avatar :title="name" :color="color" :size="size">
    <img v-if="imageUrl" :src="imageUrl" alt="Avatar" />
    <span v-else :class="theme" class="white--text title">{{ initials }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { colorFromText } from '@/utils/text';

@Component({})
export default class Avatar extends Vue {
  @Prop() imageUrl!: string;
  @Prop() name!: string;
  @Prop() size!: number;

  get initials() {
    return this.name ? this.name.substr(0, 2) : '??';
  }

  get color() {
    return colorFromText(this.name || '');
  }
}
</script>
