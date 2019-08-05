<template>
  <div :style="style" class="tag-outline" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { sizeToStyle } from '@/utils/style';

@Component({})
export default class TagOutline extends Vue {
  @Prop({ default: null }) tag!: any;

  get style() {
    return sizeToStyle(this.tag);
  }
}
</script>

<style scoped>
.tag-outline {
  border: 1px dashed rgba(255, 255, 255, 0.5);
  outline: 1px dashed rgba(0, 0, 0, 0.5);
  position: absolute;
}
</style>
