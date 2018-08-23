<template>
  <div :style="style" :class="{'is-editable': editable}" class="tag">
    <button v-if="editable"
            class="button is-clear tag-remove"
            title="Untag"
            @click="removeTag">&times;</button>
    <p>
      <span v-show="!isEditing" class="name" @click="editTag">{{ tag.name }}</span>
      <input v-autofocus
             v-if="isEditing"
             v-model="name"
             :style="inputStyle"
             type="text"
             @keyup.esc="cancelTag"
             @keyup.enter="saveTag">
      <button v-if="editable && !isEditing"
              class="button is-clear tag-edit"
              title="Edit tag"
              @click="editTag">
        <span class="icon"><i class="bx bx-pencil" /></span>
      </button>
    </p>
  </div>
</template>


<script>
  import { sizeToStyle } from '../../utils/style';


  export default {
    props: {
      editable: { default: false, type: Boolean },
      tag:      { default: () => null, type: Object },
      origSize: { default: () => {}, type: Object },
    },

    data: () => ({ name: '' }),

    computed: {
      inputStyle() { return { top: this.tag.height + 3 + 'px' }; },
      isEditing()  { return this.tag.status === 'editing' || this.tag.status === 'new'; },
      style()      { return sizeToStyle(this.tag, this.origSize); }
    },

    methods: {
      cancelTag() { console.log('Tag.cancel'); this.$emit('cancelTag', { id: this.tag.id }); },
      editTag()    { console.log('Tag.onEdit'); this.editable && this.$emit('editTag', { id: this.tag.id }); },
      removeTag()  { console.log('Tag.remove'); this.$emit('removeTag', { id: this.tag.id }); },
      saveTag(e)   { console.log('Tage.save'); this.$emit('saveTag', { id: this.tag.id, name: e.target.value }); },
    }
  };
</script>


<style scoped>
  .tag {
    border: 1px solid rgba(255, 255, 255, 0.25);
    opacity: 0;
    outline: 1px solid rgba(0, 0, 0, 0.25);
    position: absolute;
  }

  .tag.is-editable,
  .tag:hover {
    opacity: 1;
  }

  .tag button {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: var(--color-text);
    height: 30px;
    padding: 0;
    width: 30px;
  }
  .tag:not(.is-editable) button {
    display: none;
  }

  .tag-remove {
    position: absolute;
    right: -15px;
    top: -15px;
  }

  .tag-edit {
    margin-left: 5px;
  }

  .tag p {
    left: 0;
    margin: 5px 0 0;
    position: absolute;
    text-align: center;
    top: 100%;
    width: 100%;
  }

  .tag .name {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    display: inline-block;
    padding: 2px 5px;
  }

</style>
