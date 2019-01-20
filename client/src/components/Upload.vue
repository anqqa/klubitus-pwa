<template>
  <div class="upload">
    <FilePond ref="pond"
              :accepted-file-types="types.join(', ')"
              :allow-multiple="multiple"
              :allow-revert="false"
              :drop-on-element="false"
              :drop-on-page="true"
              :instant-upload="false"
              :name="name"
              :server="server"
              @processfile="onUploaded"
              @processfilestart="onUploading"
              @updatefiles="onFilesUpdated" />
  </div>
</template>


<script>
  import 'filepond/dist/filepond.min.css';
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

  import { FileStatus } from 'filepond';
  import vueFilePond from 'vue-filepond';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';


  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);


  export default {
    name: 'Upload',

    components: { FilePond },

    props: {
      endpoint: { default: '', type: String },
      metadata: { default: () => null, type: Object },
      multiple: { default: false, type: Boolean },
      name:     { default: 'files', type: String },
      types:    { default: () => ['image/jpeg', 'image/png'], type: Array },
    },

    data() {
      return { files: [] };
    },

    computed: {
      server() {
        return {
          url:     process.env.API_URL,
          fetch:   null,
          load:    null,
          restore: null,
          revert:  null,
          process: {
            headers: {
              'Authorization': `Bearer ${this.$store.state.auth.token}`,
            },
            method:  'POST',
            onerror: response => response.data,
            url:     this.endpoint,
          }
        };
      }
    },

    methods: {
      getFiles() {
        const files = [];

        this.$refs.pond.getFiles().forEach(file => {
          files.push({
            filename:  file.filename,
            filesize:  file.fileSize,
            failed:    file.status === FileStatus.PROCESSING_ERROR,
            uploaded:  file.status === FileStatus.PROCESSING_COMPLETE,
            uploading: file.status === FileStatus.PROCESSING,
          });
        });

        return files;
      },

      onFilesUpdated(items) {
        const duplicates = [];

        items.forEach(item => {
          if (duplicates.includes(item.filename)) {
            this.$refs.pond.removeFile(item);
          }
          else {
            duplicates.push(item.filename);
          }
        });

        this.$emit('filesUpdated', this.getFiles());
      },

      onUploaded(error, file) {
        console.log('Finished uploading file', { file, error });

        this.$emit('filesUpdated', this.getFiles());
      },

      onUploading(file) {
        console.log('Starting to upload file', { file });

        this.$emit('filesUpdated', this.getFiles());
      },

      upload() {
        if (this.metadata) {
          this.$refs.pond.getFiles().forEach(file =>
            Object.entries(this.metadata).forEach(([key, value]) => file.setMetadata(key, value))
          );
        }

        this.$refs.pond.processFiles()
          .then(() => console.log('All upload finished'))
          .catch(error => console.log('Upload failed', { error }));
      }
    },

  };
</script>


<style scoped>
</style>