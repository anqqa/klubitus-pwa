<template>
  <div>
    <div v-if="preview" class="markdown" v-html="markdown"></div>

    <header>
      <v-btn small text @click="preview = !preview">
        <v-icon left v-text="preview ? 'mdi-markdown' : 'mdi-markdown-outline'" />
        Preview
      </v-btn>
    </header>

    <v-textarea filled :value="draft" @input="update" />
  </div>
</template>

<script lang="ts">
import debounce from 'lodash/debounce';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Editor extends Vue {
  get markdown(): string {
    return this.$md.render(this.draft || '*Empty*');
  }
  @Prop() value?: string;

  draft = this.value || '';
  preview = false;

  update = debounce(this.setValue, 250);

  setValue(value: string) {
    this.draft = value;

    this.$emit('input', value);
  }
}
</script>

<style scoped></style>
