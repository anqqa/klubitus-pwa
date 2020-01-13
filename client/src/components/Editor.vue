<template>
  <div>
    <div v-if="preview" class="markdown pb-4" v-html="markdown"></div>

    <header>
      <v-tooltip v-for="(b, i) in buttons" :key="i" top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" small icon @click="format(b)">
            <v-icon small v-text="b.icon" />
          </v-btn>
        </template>
        <span>
          <kbd v-if="b.shortcut">{{ shortcutKey }}{{ b.shortcut.toUpperCase() }}</kbd>
          {{ b.text }}
        </span>
      </v-tooltip>

      <v-btn small text @click="preview = !preview" class="float-right">
        <v-icon left v-text="preview ? 'mdi-markdown' : 'mdi-markdown-outline'" /> Preview
      </v-btn>
    </header>

    <v-textarea auto-grow filled ref="textarea" solo :value="draft" @input="update" />
  </div>
</template>

<script lang="ts">
import debounce from 'lodash/debounce';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

interface ButtonConfig {
  icon?: string;
  post?: string;
  pre?: string;
  shortcut?: string;
  text?: string;
}

@Component({})
export default class Editor extends Vue {
  get markdown(): string {
    return this.$md.render(this.draft || '###### *Empty*');
  }

  get shortcutKey(): string {
    return this.isMac ? '⌘' : '⌃';
  }
  buttons: ButtonConfig[] = [
    { icon: 'mdi-format-bold', pre: '**', post: '**', text: 'Bold', shortcut: 'b' },
    { icon: 'mdi-format-italic', pre: '*', post: '*', text: 'Italic', shortcut: 'i' },
    { icon: 'mdi-format-strikethrough', pre: '~~', post: '~~', text: 'Strikethrough' },
    { icon: 'mdi-format-header-1', pre: '# ', post: '', text: 'Heading 1', shortcut: '1' },
    { icon: 'mdi-format-header-2', pre: '## ', post: '', text: 'Heading 2', shortcut: '2' },
    { icon: 'mdi-format-header-3', pre: '### ', post: '', text: 'Heading 3', shortcut: '3' },
  ];

  @Prop() value?: string;

  draft = this.value || '';
  preview = false;

  update = debounce(this.setValue, 250);

  beforeDestroy() {
    // @ts-ignore
    this.$refs.textarea.$refs.input.removeEventListener('keydown', this.shortcut);
  }

  buttonTitle(button: ButtonConfig) {
    return button.text + (button.shortcut ? ' [Ctrl + ' + button.shortcut + ']' : '');
  }

  focus() {
    (this.$refs.textarea as HTMLTextAreaElement).focus();
  }

  format(button: ButtonConfig) {
    this.wrap(button.pre, button.post);
  }

  get isMac() {
    return navigator?.platform.toUpperCase().indexOf('MAC') > -1;
  }

  mounted() {
    // @ts-ignore
    this.$refs.textarea.$refs.input.addEventListener('keydown', this.shortcut);
  }

  setValue(value: string) {
    this.draft = value;

    this.$emit('input', value);
  }

  shortcut(e: KeyboardEvent) {
    const button = this.buttons.find(b => b.shortcut && e.key.toLowerCase() === b.shortcut);

    if (button && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();

      this.wrap(button.pre, button.post);
    }
  }

  wrap(pre: string = '', post: string = '') {
    const textarea = (this.$refs.textarea as Vue).$refs.input as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    this.setValue(
      textarea.value.substring(0, start) +
        pre +
        textarea.value.substring(start, end) +
        post +
        textarea.value.substring(end)
    );
    textarea.focus();

    // Update cursor
    this.$nextTick(() => {
      textarea.selectionEnd = end + pre.length;
    });
  }
}
</script>
