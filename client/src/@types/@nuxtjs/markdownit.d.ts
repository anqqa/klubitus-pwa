// tslint:disable:interface-name
import MarkdownIt from 'markdown-it';
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $md: MarkdownIt;
  }
}
