<template>
  <div class="result">
    <div class="title">{{ results[resultIndex].title }}</div>
    <div class="desc">
      <p>{{ results[resultIndex].desc }}</p>
      <div class="details">        
        <div class="content">  
          <span
            :class="{
              'question-number': true,
              green: selectedAnswers[`a${index}`].is_correct === true,
              red: selectedAnswers[`a${index}`].is_correct === false,
              neutral: selectedAnswers[`a${index}`].is_correct === null,
              active: currentQuestion === index,
            }"
            v-for="(q, index) in questions" 
            :key="index"
            @click.prevent="currentQuestion = index"
          >
            {{ index + 1 }}
          </span>
        </div>
        <div class="color-scheme">
          <div>
            <span>
              red
            </span>
            <span>
              incorrect
            </span>
          </div>
          <div>
            <span>
              green
            </span>
            <span>
              correct
            </span>
          </div>
          <div>
            <span>
              neutral
            </span>
            <span>
              unanswered
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="result-questions">
      <Questions  
        :isCssActive="false"
        :isShowAnswersActive="true"
        :questions="questions"
        :currentQuestion="currentQuestion"
        :selectedAnswers="selectedAnswers"
      />
      <button
        type="button"
        class="btn reset-btn"
        @click.prevent="$emit('reset')"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import Questions from './Questions.vue'
export default {
  name: 'Result',
  props: {
    questions: Object, 
    results: Object, 
    totalCorrect: Number,
    questionsAnswered: Number,
    selectedAnswers: Object,
  },
  emits: ['reset'],
  data () {
    return {
      currentQuestion: 0,      
    }
  },
  components: {
    Questions,
  },
  computed: {
    resultIndex() {
      let index = 0;

      this.results.forEach((e, i)=>{
        if(e.min <= this.totalCorrect && e.max >= this.totalCorrect){
          index = i;
        }
      })
      return index;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.result-questions {
  margin-top: 20px;
}

.desc {

  & .content {
    display: grid;    
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 5px;
    align-items: center;
    padding-top: 20px !important;
  }
  & .question-number {    
    display: initial;
    border-radius: $border-radius;
    padding: 6px 0px;
    cursor: pointer;
    color: $text-white;
    font-weight: bold;

    &.red {
      background-color: $question-number-red;
      &:hover {
        background-color: $question-number-red-hover;
      }
      &.active, &:active {
        background-color: $question-number-red-active;
      }
    }
    &.green {
      background-color: $question-number-green;
      &:hover {
        background-color:$question-number-green-hover;
      }
      &.active, &:active {
        background-color: $question-number-green-active;
      }
    }

    &.neutral {
      background-color: $question-number-neutral;
      &:hover {
        background-color: $question-number-neutral-hover;
      }
      &.active, &:active {
        background-color: $question-number-neutral-active;
      }
    }
  }

  & p:first-child {
    padding-bottom: 10px;
  }
  & .details {    
    align-items: center;
    border-top: 2px solid #eee;

    & .content {
      font-size: 15px;
      // align-self: start;
      padding-top: 35px;

      p {
        font-size: 24px;
        text-align: start;
      }
      &:first-child {
        justify-self: center;
      }
      &:last-child {
        justify-self: start;
      }
    }
  }
}
</style>