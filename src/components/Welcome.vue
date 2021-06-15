<template>
  <p>
    Take the quiz.
    <br/>
    Whenever, you want.
  </p>
  <button      
    type="button"
    class="btn start-btn"
    @click.prevent="$emit('start-quiz')"
  >
    Start
  </button>
</template>

<script>
export default {
  name: 'Welcome',  
  emits: ['start-quiz'],
}
</script>

<style>

</style>