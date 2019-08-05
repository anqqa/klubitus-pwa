<template>
  <div class="labels">
    <ul>
      <LabelTree v-for="label in labels" :key="label.name" :label="label" />
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import LabelTree from './LabelTree.vue';

@Component({
  components: { LabelTree },
})
export default class Labels extends Vue {
  @Prop({ default: [] }) labels!: any[];
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
