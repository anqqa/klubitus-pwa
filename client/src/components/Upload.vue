<template>
  <div class="upload">
    <no-ssr>
      <FilePond
        ref="pond"
        :accepted-file-types="types.join(', ')"
        :allow-file-type-validation="true"
        :allow-multiple="multiple"
        :allow-revert="false"
        :drop-on-element="false"
        :drop-on-page="true"
        :instant-upload="false"
        :name="name"
        :server="server"
        style-item-panel-aspect-ratio="1"
        @processfile="onUploaded"
        @processfilestart="onUploading"
        @updatefiles="onFilesUpdated"
      />
    </no-ssr>
  </div>
</template>

<script lang="ts">
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import { FileStatus } from 'filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import vueFilePond from 'vue-filepond';

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

@Component({
  components: { FilePond },
})
export default class Upload extends Vue {
  @Prop() endpoint!: string;
  @Prop() metadata!: any;
  @Prop() multiple!: boolean;
  @Prop({ default: 'files' }) name!: string;
  @Prop({ default: () => ['image/jpeg', 'image/png'] }) types!: string[];

  // @ts-ignore
  $refs: {
    pond: any;
  };

  files = [];

  get server() {
    return {
      url: process.env.API_URL,
      fetch: null,
      load: null,
      restore: null,
      revert: null,
      process: {
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        method: 'POST',
        onerror: response => response.data,
        url: this.endpoint,
      },
    };
  }

  getFiles() {
    const files: Array<{
      filename: string;
      filesize: number;
      failed: boolean;
      uploaded: boolean;
      uploading: boolean;
    }> = [];

    this.$refs.pond.getFiles().forEach(file => {
      files.push({
        filename: file.filename,
        filesize: file.fileSize,
        failed: file.status === FileStatus.PROCESSING_ERROR,
        uploaded: file.status === FileStatus.PROCESSING_COMPLETE,
        uploading: file.status === FileStatus.PROCESSING,
      });
    });

    return files;
  }

  onFilesUpdated(items) {
    const duplicates: string[] = [];

    items.forEach(item => {
      if (duplicates.includes(item.filename)) {
        this.$refs.pond.removeFile(item);
      } else {
        duplicates.push(item.filename);
      }
    });

    this.$emit('filesUpdated', this.getFiles());
  }

  onUploaded(error, file) {
    console.log('Finished uploading file', { file, error });

    this.$emit('filesUpdated', this.getFiles());
  }

  onUploading(file) {
    console.log('Starting to upload file', { file });

    this.$emit('filesUpdated', this.getFiles());
  }

  upload() {
    if (this.metadata) {
      this.$refs.pond
        .getFiles()
        .forEach(file =>
          Object.entries(this.metadata).forEach(([key, value]) => file.setMetadata(key, value))
        );
    }

    this.$refs.pond
      .processFiles()
      .then(() => console.log('All upload finished'))
      .catch(error => console.log('Upload failed', { error }));
  }
}
</script>

<style>
/*
  .filepond--item {
    width: calc(50% - 0.5em);
  }

  @media (min-width: 480px) {
    .filepond--item {
      width: calc(33% - 0.5em);
    }
  }
   */
</style>
