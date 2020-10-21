<template>
  <div class="popover" ref="root">
    <button type="text" class="trigger" @click="onToggle">
      <span class="preview" :style="{ 'background-color': value }" />
    </button>
    <transition :name="currentTransitionName">
      <div v-if="isVisible" class="frame" :class="framePositionClass">
        <color-picker :value="value" :with-suggestions="withSuggestions" @input="onInput" />
      </div>
    </transition>
  </div>
</template>

<script>
import ColorPicker from './VColorPicker.vue'

const POSITIONS = {
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
}

export default {
  name: 'VColorPopover',

  components: {
    ColorPicker,
  },

  props: {
    value: {
      type: String,
      default: '#ff0000',
    },
    withSuggestions: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: POSITIONS.BOTTOM,
      validator: value => Object.values(POSITIONS).includes(value),
    },
  },

  data: () => ({
    isVisible: false,
  }),

  computed: {
    currentTransitionName() {
      switch (this.position) {
        case POSITIONS.BOTTOM:
          return 'slide-down'
        case POSITIONS.LEFT:
          return 'slide-left'
        case POSITIONS.RIGHT:
          return 'slide-right'
        case POSITIONS.TOP:
          return 'slide-up'
      }
    },
    framePositionClass() {
      switch (this.position) {
        case POSITIONS.BOTTOM:
          return 'bottom'
        case POSITIONS.LEFT:
          return 'left'
        case POSITIONS.RIGHT:
          return 'right'
        case POSITIONS.TOP:
          return 'top'
      }
    }
  },

  watch: {
    isVisible(val) {
      if (val) {
        document.body.addEventListener('click', this.onClickOutside)
        return
      }

      document.body.removeEventListener('click', this.onClickOutside)
    }
  },

  methods: {
    onToggle() {
      this.isVisible = !this.isVisible
    },
    onClickOutside(e) {
      if (e.path.includes(this.$refs.root)) return

      this.isVisible = false
    },
    onInput(val) {
      this.$emit('input', val)
    }
  },
}
</script>

<style lang="postcss" scoped>
.popover {
  position: relative;
}

.trigger {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.preview {
  flex: 1 1 auto;
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
}

.frame {
  position: absolute;
  z-index: 10;

  &.bottom {
    left: 0;
    top: calc(100% + 12px);
  }

  &.top {
    left: 0;
    bottom: calc(100% + 12px);
  }

  &.left {
    right: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
  }

  &.right {
    left: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
  }
}

.slide-down-enter-active {
  animation: slideDown 0.25s;
}

.slide-down-leave-to {
  animation: slideDown 0.25s reverse;
}

@keyframes slideDown {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
}

.slide-up-enter-active {
  animation: slideUp 0.25s;
}

.slide-up-leave-to {
  animation: slideUp 0.25s reverse;
}

@keyframes slideUp {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }
}

.slide-left-enter-active {
  animation: slideLeft 0.25s;
}

.slide-left-leave-to {
  animation: slideLeft 0.25s reverse;
}

@keyframes slideLeft {
  from {
    transform: translateX(-15px) translateY(-50%);
    opacity: 0;
  }
}

.slide-right-enter-active {
  animation: slideRight 0.25s;
}

.slide-right-leave-to {
  animation: slideRight 0.25s reverse;
}

@keyframes slideRight {
  from {
    transform: translateX(15px) translateY(-50%);
    opacity: 0;
  }
}
</style>
