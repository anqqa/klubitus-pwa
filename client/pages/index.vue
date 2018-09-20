<template>
  <main>
    <div class="row">

      <div class="col-4">
        <Chat class="dense" limit="10" />
      </div>

      <div class="col">

      </div>

      <div class="col-4">

      </div>

    </div>
  </main>
</template>


<script>
  import Chat from '../components/Chat';


  export default {
    components: { Chat },
  }


</script>
