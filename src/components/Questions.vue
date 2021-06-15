<template>
    <transition-group name="fade">
     <div 
      class="single-question" 
      v-for="(question, qIndex) in questions" 
      :key="question.q"
      v-show="qIndex === currentQuestion"
    >     
      <div class="question" v-html="questionWithNumber(qIndex, question.q)" />
      <div class="answers">
        <div 
          :class="{ answer: true, 'is-answered': isAnswered(qIndex, answer.text) }" 
          v-for="answer in question.answers"
          :key="answer.text"
          @click.prevent = "selectAnswer(answer.is_correct, answer.text, qIndex)"
          v-html="answer.text"
        />            
      </div>
     </div>
    </transition-group>
</template>

<script>
export default {
  name: 'Questions',
  props: ['questions', 'currentQuestion', 'selectedAnswers'],
  emits: ['question-answered'],
  methods: {
    selectAnswer(is_correct, text, index) {
      this.$emit('question-answered', is_correct, text, index)
    },
    isAnswered(index, text) {
      return this.selectedAnswers[`a${index}`].text === text;
    },
    questionWithNumber(questionNumber, question) {
      return `
      <div class="question-number">
        <span>${questionNumber + 1}.</span>      
        <span>${question}</span$>      
      </div>`;
    }
  },
}
</script>