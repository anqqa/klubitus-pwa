<template>
  <nav aria-label="Breadcrumb">
    <ol>
      <li v-for="(trail, index) in breadcrumbs" :key="index">
        <nuxt-link v-if="trail.current" :to="trail.url" aria-current="page">{{
          trail.title
        }}</nuxt-link>
        <nuxt-link v-else :to="trail.url">{{ trail.title }}</nuxt-link>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Breadcrumbs extends Vue {
  @Prop() breadcrumbs?: string[];
}
</script>
