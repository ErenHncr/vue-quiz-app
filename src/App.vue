<template>
  <div
    v-if="loading"
    class="loading"
  >
    <i class="fas fa-spinner fa-spin"></i>
  </div>
  <div v-else>
    <div v-if="progress !== 0 || results.length != 0" class="ctr">
      <button      
        type="button"
        :class="{btn: true, 'prev-btn': true, hide: currentQuestion === 0}"
        @click.prevent="changeCurrentQuestionIndex(-1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <transition name="fade" mode="out-in">
        <div 
          class="questions-ctr"
          v-if="questionsAnswered < questions.length"
        >
          <Progress
            :questions="questions"
            :questionsAnswered="questionsAnswered"
          />
          <Timer 
            :progress="progress" 
            @update-progress="updateProgress"
          />
          <Questions        
            :questions="questions"
            :currentQuestion="currentQuestion"
            :selectedAnswers="selectedAnswers"
            @question-answered="setQuestionAnswered"
          />
        </div> 
      </transition>    
      <button
        v-show="!loading"
        type="button"
        :class="{btn: true, 'next-btn': true, hide: currentQuestion === (questions.length - 1)}"
        @click.prevent="changeCurrentQuestionIndex(1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div class="result" v-else>
      <Result :results="results" :totalCorrect="totalCorrect" />
      <button
        type="button"
        class="btn reset-btn"
        @click.prevent="reset()"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import Progress from './components/Progress.vue'
import Questions from './components/Questions.vue'
import Result from './components/Result.vue'
import Timer from './components/Timer.vue'
export default {
  name: 'App',
  components: {
    Questions,
    Result,
    Progress,
    Timer,
  },
  data () {
    return {
      loading: true,
      progress: 100,
      currentQuestion: 0,
      selectedAnswers: {},
      questions: [],
      results: [
        {
          min: 0,
          max: 5,
          title: "Try again!",
          desc: "Do a little more studying and you may succeed!"
        },
        {
          max: 10,
          min: 6,
          title: "Wow, you're a genius!",
          desc: "Studying has definitely paid off for you!"
        }
      ]
    }
  },
  methods: {
    updateProgress(value) {
      this.progress = value;
    },
    changeCurrentQuestionIndex(value) {
      // increment & decrement
      if((this.currentQuestion + 1 < this.questions.length && value > 0) 
        || (this.currentQuestion > 0  && value < 0)){
        this.currentQuestion += value;          
      }     
    },
    setQuestionAnswered(is_correct, text, index) {
      this.selectedAnswers = {
        ...this.selectedAnswers,
        [`a${index}`]: {
          text,
          is_correct
        }
      };
    },
    reset() {
      this.fetchNewQuestions();
    },
    async fetchNewQuestions() { 
      const req = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy');
      const { results } = await req.json();
      let emptySelectedAnswers = {};
      const questions = results.map((r, index)=>{
        emptySelectedAnswers = Object.assign({ 
          [`a${index}`]: {
          text: '',
          is_correct: false,
        } 
        }, emptySelectedAnswers);
        const fixedAnswers = (arr = [], is_correct = false) => {
          return arr.map((answer)=>{
            return {
              text: answer,
              is_correct,
            };
          });
        }
        return {
          q: r?.question,
          type: r?.type,
          answers: [ ...fixedAnswers(r?.incorrect_answers), {
            text: r?.correct_answer,
            is_correct: true
          } ]
        }
      });
      this.selectedAnswers = emptySelectedAnswers;
      this.questions = questions;
      this.loading = false;
    },
  },
  computed: {
    totalCorrect() {
      let correctCount = 0;
      const obj = this.selectedAnswers;
      Object.keys(obj).forEach((key) => {
        if(obj[key]?.is_correct === true) correctCount += 1;
      });
      return correctCount;
    },
    questionsAnswered() {
      let answeredCount = 0;
      const obj = this.selectedAnswers;
      Object.keys(obj).forEach((key) => {      
        if(obj[key]?.text !== '') answeredCount += 1;
      });
      return answeredCount;
    }
  },
  beforeMount: function(){ 
    this.loading = true;
  },
  mounted: async function(){ 
    this.fetchNewQuestions();    
  }
}
</script>

<style lang="scss">
// This comment line required for importing scss files
</style>