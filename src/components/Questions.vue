<template>
  <transition-group name="fade" mode="out-in" :css="isCssActive" tag="div">
    <div 
      class="single-question" 
      v-for="(question, qIndex) in questions" 
      :key="question.q"
      v-show="qIndex === currentQuestion"
    >     
      <div :class="{ 
        'question': true,
        'result-question': isShowAnswersActive,
        }" 
        v-html="questionWithNumber(qIndex, question.q)" />
      <div class="answers">
        <div 
          :class="{ 
            answer: true, 
            'is-answered': isAnswered(qIndex, answer.text),
            'bg-correct': isCorrect(answer.is_correct),
            'bg-incorrect': isCorrect(!answer.is_correct),
          }" 
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
  props: {
    isCssActive: {
      type: Boolean,
      default: true,
    },
    isShowAnswersActive: {
      type: Boolean,
      default: false,
    },
    questions: Object,
    currentQuestion: Number,
    selectedAnswers: Object,
  },
  emits: ['question-answered'],
  methods: {
    selectAnswer(is_correct, text, index) {
      this.$emit('question-answered', is_correct, text, index)
    },
    isAnswered(index, text) {
      return this.selectedAnswers[`a${index}`].text === text;
    },
    isCorrect(isCorrect){
      return this.isShowAnswersActive && isCorrect;
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