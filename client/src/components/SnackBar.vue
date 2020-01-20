<template>
  <v-snackbar v-model="show" color="error" :timeout="0">
    {{ message }}
    <v-btn text @click.native="close">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

import { Mutations, uiStore } from '@/store/ui';

@Component({})
export default class SnackBar extends Vue {
  message = '';
  show = false;

  @uiStore.State('error')
  error!: string | null;

  @uiStore.Mutation(Mutations.SET_ERROR)
  setError!: (error: string | null) => void;

  close() {
    this.setError(null);
  }

  @Watch('error')
  onMessageChange() {
    this.message = this.error || '';
    this.show = !!this.error;
  }
}
</script>
