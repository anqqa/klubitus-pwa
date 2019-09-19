<template>
  <v-row>
    Friends
    <v-col cols="12" md="4" order-md="last"> </v-col>

    <v-col md="8"> </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Profile extends Vue {
  get userId(): number {
    return parseInt(this.$route.params.id);
  }
}
</script>
