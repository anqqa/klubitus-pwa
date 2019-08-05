<template>
  <main>
    <div class="row">
      <div class="col-4">
        <Chat :limit="10" class="dense" />
      </div>

      <div class="col">
        <Newsfeed :limit="20" />
      </div>

      <div class="col-3"></div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Chat from '../components/Chat.vue';
import Newsfeed from '../components/Newsfeed.vue';

@Component({
  components: { Chat, Newsfeed },
})
export default class Index extends Vue {}
</script>
