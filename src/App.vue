<template>
  <Modal 
    v-show="showModal" 
    @close="showModal = false"
    @on-success="isTestSubmitted = true, showModal = false"
  >    
    <template v-slot:header>
      <i class="fas fa-exclamation-triangle warning-icon"></i>
      <p>Are you sure?</p>
    </template>
    <template v-slot:body>
      <p>Do you really want to submit? This process cannot be undone.</p>
    </template>
  </Modal>
  <div
    v-if="loading"
    class="loading"
  >
    <i class="fas fa-spinner fa-spin"></i>
  </div>
  <div 
    v-else-if="testFinished === null"
    :class="{welcome: true, in: !isWelcomeOut, out: isWelcomeOut}"
  >  
      <Welcome
        @start-quiz="startQuiz()"
      />
  </div>
  <div v-else>
    <div v-if="!isTestFinished" class="ctr">
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
        >
          <Progress
            :questions="questions"
            :questionsAnswered="questionsAnswered"
          />
          <Timer 
            :progress="progress" 
            :testFinished="testFinished"
            :fiveMinutesInMiliseconds="fiveMinutesInMiliseconds"
            @update-progress="updateProgress"
          />
          <Questions        
            :questions="questions"
            :currentQuestion="currentQuestion"
            :selectedAnswers="selectedAnswers"
            @question-answered="setQuestionAnswered"
          />
          <button            
            type="button"
            class="btn submit-btn"
            @click.prevent="showModal = true"
          >
            Submit
          </button>            
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
    <div v-else>
      <Result 
        :results="results" 
        :questions="questions"
        :selectedAnswers="selectedAnswers"
        :totalCorrect="totalCorrect"
        :questionsAnswered="questionsAnswered"
        @reset="reset()"
      />      
    </div>
  </div>
</template>

<script>
import Progress from './components/Progress.vue'
import Questions from './components/Questions.vue'
import Result from './components/Result.vue'
import Timer from './components/Timer.vue'
import Welcome from './components/Welcome.vue'
import Modal from './components/Modal.vue'
export default {
  name: 'App',
  components: {
    Questions,
    Result,
    Progress,
    Timer,
    Welcome,
    Modal,
  },
  data () {
    return {
      showModal: false,
      isWelcomeOut: false,
      // timer variables
      loading: true,
      progress: 100,
      testFinished: null,
      isTestSubmitted: false,
      fiveMinutesInMiliseconds: 5 * 60 * 1000,
      // timer variables
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
    startQuiz() {
      this.isWelcomeOut = true;
      // 5 minute added
      setTimeout(() => {
        this.testFinished = new Date().getTime() + (this.fiveMinutesInMiliseconds) + 1000;
      }, 600);      
    },
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
      this.progress = 100;
      this.isWelcomeOut = false;
      this.testFinished = null;
      this.isTestSubmitted = false;
      this.currentQuestion = 0;
    },
    async fetchNewQuestions() { 
      const req = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy');
      const { results } = await req.json();
      let emptySelectedAnswers = {};
      const questions = results.map((r, index)=>{
        emptySelectedAnswers = Object.assign({ 
          [`a${index}`]: {
          text: '',
          is_correct: null,
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
    isTestFinished() {
      return this.progress === 0 || this.isTestSubmitted;
    },
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