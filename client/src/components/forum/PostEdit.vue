<template>
  <v-card>
    <v-card-title v-if="title">{{ title }}</v-card-title>
    <v-form>
      <v-list-item three-line>
        <v-list-item-avatar>
          <avatar :user="user" size="40" />
        </v-list-item-avatar>

        <v-list-item-content>
          <Editor :value="text" @input="val => (draft = val)" />

          <footer>
            <v-btn color="primary" class="mr-4" @click="$emit('save', draft)">Save</v-btn>
          </footer>
        </v-list-item-content>
      </v-list-item>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import Editor from '@/components/Editor.vue';
import { UserState } from '@/store/auth';

@Component({
  components: { Avatar, Editor },
})
export default class PostEdit extends Vue {
  @Prop() text?: string;
  @Prop() title?: string;
  @Prop() user?: UserState | null;

  draft = this.text;

  save() {}
}
</script>

<style scoped></style>
