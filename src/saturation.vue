<template lang="pug">
ctrl(
  :class="styles.paletteWrap",
  dir="both",
  v-model="model"
)
  div(:class="styles.palettePane", :style="{background: `red`}")
    div(:class="styles.paletteWhite")
    div(:class="styles.paletteBlack")
</template>

<script>
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import classnames from 'classnames';
import styles from './v-color.css';
const clsn = (...names) => classnames(names.map(n => styles[n]));
const percent = num => `${num * 100}%`;
const limit01 = num => Math.min(Math.max(num, 0), 1);

import ctrl from './ctrl.vue';

export default {
  name: 'v-color-saturation',
  props: {
    value: {
      type: Object
    }
  },
  components: { ctrl },
  data() {
    return {
      styles: {
        paletteWrap: clsn('vcolor__saturation__wrap'),
        palettePane: clsn('vcolor__saturation__pane'),
        paletteWhite: clsn('vcolor__saturation__white'),
        paletteBlack: clsn('vcolor__saturation__black')
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
