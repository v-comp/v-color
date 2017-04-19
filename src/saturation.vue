<template lang="pug">
ctrl(
  :class="styles.paletteWrap",
  style="margin: 0"
  dir="both",
  v-model="model"
)
  div(:class="styles.palettePane", :style="{background: bgcolor}")
    div(:class="styles.paletteWhite")
    div(:class="styles.paletteBlack")
</template>

<script>
import classnames from 'classnames';
import styles from './v-color.css';
const clsn = (...names) => classnames(names.map(n => styles[n]));

import ctrl from './ctrl.vue';

export default {
  name: 'v-color-saturation',
  props: {
    value: {
      type: Object
    },
    bgcolor: Number
  },
  components: { ctrl },
  data() {
    return {
      styles: {
        paletteWrap: clsn('saturation-wrap'),
        palettePane: clsn('saturation-pane'),
        paletteWhite: clsn('saturation-white'),
        paletteBlack: clsn('saturation-black')
      },
      model: this.value
    };
  },
  watch: {
    model(val) {
      this.$emit('input', val);
    }
  }
};
</script>
