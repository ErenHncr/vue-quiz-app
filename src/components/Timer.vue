<template>
  <div class="timer">
    <div 
      class="bar" 
      :style="{ width: `${progress}%`}"></div>
    <div class="status">
      <span v-if="progress > 0">
        {{ minutes }}:{{ seconds }}
      </span>
      <span v-else>Time is up!</span>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    progress: Number,
    testFinished: Number,
    fiveMinutesInMiliseconds: Number,
  },
  emits: ['update-progress'],
  data(){
    return {
      interval: null,
      minutes: '05',
      seconds: '00',
    }
  },
  methods: {    
    getTwoDigit(value) {
      return value.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false });
    },
    updateProgress(){      
      const diff = Math.max(0, this.testFinished - new Date().getTime());
      const progress = 100 * diff / (this.fiveMinutesInMiliseconds);
      // get minutes
      const minutes = parseInt((diff / 1000 / 60), 10);
      // get seconds
      const seconds = parseInt((diff / 1000 % 60), 10);
      
      if(progress <= 0) {
        clearInterval(this.interval);
      }    
      this.$emit('update-progress', parseInt(progress, 10))
      this.minutes = this.getTwoDigit(minutes);
      this.seconds = this.getTwoDigit(seconds);      
    }
  },
  mounted() {
    this.interval = window.setInterval(() => {
      this.updateProgress();
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  }
}
</script>