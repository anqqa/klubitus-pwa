<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-flex md8>
        <Newsfeed :limit="20" />
      </v-flex>

      <v-flex md4>
        <Chat :limit="10" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Chat from '@/components/Chat.vue';
import Newsfeed from '@/components/Newsfeed.vue';

@Component({
  components: { Chat, Newsfeed },
  head: { title: 'Home' },
})
export default class Index extends Vue {}
</script>
