<template>

  <div :class="{'is-editable': editable}"
       class="tags"
       @mousedown="onStartDrawing"
       @mousemove="onDraw"
       @mouseup="onStopDrawing">
    <slot>Image</slot>
    <Tag v-for="tag in tagList"
         :editable="editable"
         :key="tag.id"
         :tag="tag"
         :orig-size="origSize"
         @cancelTag="onCancel"
         @editTag="onEdit"
         @removeTag="onRemove"
         @saveTag="onSave" />
    <TagOutline v-if="newTag" :tag="newTag" />
  </div>

</template>


<script>
  import Tag from './Tag';
  import TagOutline from './TagOutline';


  const randomId = () => Math.random().toString(36).substr(2, 9);


  export default {
    components: { Tag, TagOutline },

    props: {
      editable: { default: false, type: Boolean },
      tags:     { default: () => [], type: Array },
      origSize: { default: () => {}, type: Object },
    },

    data() {
      return {
        isLocked: false,
        newTag:   null,
        tagList:  this.tags,
        position: null,
      };
    },

    methods: {
      onCancel(msg) {
        console.log('Tags.cancel', { msg });

        this.isLocked = false;

        this.tagList.forEach(tag => {
          if (tag.id === msg.id) {
            tag.status = 'ready';
          }
        })
      },

      onDraw(e) {

        // Do nothing if we're not drawing a new tag
        if (!this.editable || !this.newTag) {
          return;
        }

        this.newTag.width  = e.clientX - this.newTag.x - this.position.left;
        this.newTag.height = e.clientY - this.newTag.y - this.position.top;
      },

      onEdit(msg) {
        console.log('Tags.onEdit', { msg });

        if (!this.editable) {
          return;
        }

        this.tagList.forEach(tag => {
          if (tag.id === msg.id) {
            tag.status = 'editing';
          }
        });
      },

      onRemove(msg) {
        console.log('Tags.delete', { msg });

        this.isLocked = false;

        this.tagList = this.tagList.filter(tag => tag.id !== msg.id);
      },

      onSave(msg) {
        console.log('Tags.save', { msg });

        this.isLocked = false;

        if (!this.editable || !msg) {
          return;
        }

        this.tagList.forEach(tag => {
          if (tag.id === msg.id) {
            tag.name   = msg.name;
            tag.status = 'ready';
          }
        });
      },

      onStartDrawing(e) {
        if (!this.editable || this.isLocked) {
          return;
        }

        this.position = e.currentTarget.getBoundingClientRect();
        this.newTag   = {
          x:      e.clientX - this.position.left,
          y:      e.clientY - this.position.top,
          width:  1,
          height: 1,
          status: 'new',
          label:  '',
          id:     randomId(),
        };
      },

      onStopDrawing() {
        if (!this.editable || this.isLocked) {
          return;
        }

        // Minimum size
        if (this.newTag.width < 20 || this.newTag.height < 20) {
          this.newTag = null;

          return;
        }

        this.tagList.push(this.newTag);

        this.newTag   = null;
        this.isLocked = true;
      },
    }

  };
</script>


<style scoped>
  .tags {
    display: inline-block;
    position: relative;
  }
  .tags.is-editable {
    cursor: crosshair;
  }
</style>
