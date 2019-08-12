<template>
  <v-avatar :color="color" v-bind="$attrs">
    <img v-if="src" :src="src" alt="Avatar" />
    <span v-else class="white--text title">{{ initials }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { colorFromText } from '@/utils/text';

@Component({})
export default class Avatar extends Vue {
  @Prop() title!: string;
  @Prop() src!: string;

  get initials() {
    return this.title ? this.title.substr(0, 2) : '??';
  }

  get color() {
    return colorFromText(this.title || '');
  }
}
</script>
