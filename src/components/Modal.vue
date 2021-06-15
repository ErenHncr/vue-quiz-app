<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header"></slot>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            <i class="fas fa-times"></i>
          </button>
        </header>

        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body"></slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer"></slot>
          <button
            type="button"
            class="btn btn-cancel"
            @click.prevent="close"
            aria-label="Close modal"
          >
            No
          </button>
          <button
            type="button"
            class="btn btn-green"
            @click.prevent="onSuccess"
            aria-label="Close modal"
          >
            Yes
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  emits: ['on-success'],
  methods: {
      close() {
        this.$emit('close');
      },
      onSuccess() {
        this.$emit('on-success');
      }
  },
}
</script>

<style scoped lang="scss">
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal {
    position: relative;
    top: -60px;
    // transform-origin: -40% 50%;
    transform: translate(0%, -20%);
    background: #FFFFFF;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 100%; 
    border-radius: 8px;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: grid;   
  }

  .modal-header {
    font-size: 26px;
    font-weight: 500;
    position: relative;    
    color: #636363;
    justify-content: center;    
    text-align: center;
  }

  .modal-footer {
    grid-template: 1fr / 1fr 1fr;
    gap: 10px;
    margin-left: auto;    
  }

  .modal-body {
    position: relative;
    padding: 20px 30px;
    color: #999;
    font-size: 17px;
    font-weight: 500;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 12px 14px;
    cursor: pointer;
    font-weight: bold;
    color: #808080;
    background: transparent;
    &:hover {
      color: #929292;
    }
    &:active {
      color: #949494;
    }
  }

  .btn{
    border: none;
    outline: none;
    color: white; 
    border-radius: 4px;
    font-size: 16px;
    margin: 0px;
    transition: all .2s;
    min-width: 100px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    &-green {
      padding: 5px 15px;
      background: hsl(154, 61%, 41%);
      &:hover {
        background: hsl(154, 61%, 44%);
      }
      &:active {
        background: hsl(154, 61%, 47%);
      }
    }

    &-cancel { 
      color: white;
      background: hsl(0, 0%, 66%);

      &:hover {
        background: hsl(0, 0%, 56%);
      }
      &:active {
        background: hsl(0, 0%, 46%);
      }
    }
  }

  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease;
  }
</style>