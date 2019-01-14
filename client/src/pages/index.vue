<template>
  <main>
    <div class="row">

      <div class="col-4">
        <Chat :limit="10" class="dense" />
      </div>

      <div class="col">
        <Newsfeed :limit="20" />
      </div>

      <div class="col-3">

      </div>

    </div>
  </main>
</template>


<script>
  import Chat from '../components/Chat';
  import Newsfeed from '../components/Newsfeed';


  export default {
    components: { Chat, Newsfeed },
  }


</script>
