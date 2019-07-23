<template>
  <figure :title="name" class="image avatar is-48x48">
    <img v-if="imageUrl" :src="imageUrl" alt="Avatar" />
    <span v-else :class="theme" class="icon is-full">{{ initials }}</span>
  </figure>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { colorFromText } from '@/utils/text';

@Component({})
export default class Avatar extends Vue {
  @Prop() imageUrl!: string;
  @Prop() name!: string;

  get initials() {
    return this.name.substr(0, 2);
  }
  get theme() {
    return 'theme-' + colorFromText(this.name);
  }
}
</script>
