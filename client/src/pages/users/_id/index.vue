<template>
  <v-row>
    <v-col cols="12" md="4" order-md="last"> </v-col>

    <v-col md="8">
      <Newsfeed limit="5" title="Timeline" :user="userId" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Newsfeed from '@/components/Newsfeed.vue';

@Component({ components: { Newsfeed } })
export default class Profile extends Vue {
  get userId(): number {
    return parseInt(this.$route.params.id);
  }
}
</script>
