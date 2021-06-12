<template>
  <div class="ctr">
    <transition name="fade" mode="out-in" v-if="results.length != 0">
      <div 
        class="questions-ctr"
        v-if="questionsAnswered < questions.length"
      >
      <Progress
        :questions="questions"
        :questionsAnswered="questionsAnswered"
      />
      <Questions        
        :questions="questions"
        :currentQuestion="currentQuestion"
        :selectedAnswers="selectedAnswers"
        @question-answered="setQuestionAnswered"
      />
      </div>
      <Result v-else :results="results" :totalCorrect="totalCorrect" />
    </transition>
    <button
      v-if="questionsAnswered === questions.length"
      type="button"
      class="reset-btn"
      @click.prevent="reset()"
    >
      Reset
    </button>
  </div>
</template>

<script>
import Progress from './components/Progress.vue'
import Questions from './components/Questions.vue'
import Result from './components/Result.vue'
export default {
  name: 'App',
  components: {
    Questions,
    Result,
    Progress,
  },
  data () {
    return {
      currentQuestion: 0,
      selectedAnswers: {},
      questions: [],
      results: [
        {
          min: 0,
          max: 2,
          title: "Try again!",
          desc: "Do a little more studying and you may succeed!"
        },
        {
          max: 3,
          min: 3,
          title: "Wow, you're a genius!",
          desc: "Studying has definitely paid off for you!"
        }
      ]
    }
  },
  methods: {
    setQuestionAnswered(is_correct, text, index) {
      this.selectedAnswers = {
        ...this.selectedAnswers,
        [`a${index}`]: {
          text,
          is_correct
        }
      };
      console.log(is_correct, text, index);
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
  }
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
        console.log(key);
        if(obj[key]?.text !== '') answeredCount += 1;
      });
      return answeredCount;
    }
  },
  mounted: async function(){ 
    this.fetchNewQuestions();
  }
}
</script>

<style lang="scss">
// This comment line required for importing scss files
</style>