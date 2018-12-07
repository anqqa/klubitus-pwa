<template>
  <div class="upload">
    <FilePond ref="pond"
              name="files"
              server="http://localhost:3002/upload"
              :accepted-file-types="types.join(', ')"
              :allow-multiple="multiple"
              :drop-on-element="false"
              :drop-on-page="true"
              :instant-upload="false"
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
      multiple: { default: false, type: Boolean },
      types:    { default: () => ['image/jpeg', 'image/png'], type: Array },
    },

    data() {
      return { files: [] };
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
        this.$refs.pond.processFiles()
          .then(() => console.log('All upload finished'))
          .catch(error => console.log('Upload failed', { error }));
      }
    },

  };
</script>


<style scoped>
</style>
