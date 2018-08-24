<template>

  <div :class="{'is-editable': editable}"
       class="tags"
       @mousedown="onStartDrawing"
       @mousemove="onDraw"
       @mouseup="onStopDrawing">
    <slot />
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
      minSize:  { default: 50, type: Number },
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
          width:  this.minSize,
          height: this.minSize,
          status: 'new',
          label:  '',
          id:     randomId(),
        };
      },

      onStopDrawing() {
        if (!this.editable || this.isLocked) {
          return;
        }

        // Did we left from starting point?
        if (this.newTag.width < 0) {
          this.newTag.x     += this.newTag.width;
          this.newTag.width  = Math.abs(this.newTag.width);
        }

        // Did we move upwards from starting point?
        if (this.newTag.height < 0) {
          this.newTag.y     += this.newTag.height;
          this.newTag.height = Math.abs(this.newTag.height);
        }

        // Match new tag size to the original image size instead of displayed size
        const { clientWidth, clientHeight } = this.$slots.default[0].elm;

        const correctionX  = this.origSize.width / clientWidth;
        const correctionY  = this.origSize.height / clientHeight;
        const correctedTag = Object.assign({}, this.newTag, {
          x:      Math.max(0, Math.round(this.newTag.x * correctionX)),
          y:      Math.max(0, Math.round(this.newTag.y * correctionY)),
          width:  Math.max(this.minSize, Math.round(this.newTag.width * correctionX)),
          height: Math.max(this.minSize, Math.round(this.newTag.height * correctionY)),
        });

        // Make sure the region fits the image
        correctedTag.x = Math.min(correctedTag.x, this.origSize.width - correctedTag.width);
        correctedTag.y = Math.min(correctedTag.y, this.origSize.height - correctedTag.height);

        this.tagList.push(correctedTag);

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
