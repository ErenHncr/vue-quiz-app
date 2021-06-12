<template>
  <div class="progress">
    <div 
      class="bar" 
      :style="{ width: `${(questionsAnswered/questions.length) * 100}%`}"></div>
    <div class="status">
      {{ questionsAnswered }} out of {{ questions.length }} questions answered
    </div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    questions: Object,
    questionsAnswered: Number,
  },
}
</script>

<style>

</style>