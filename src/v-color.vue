<template lang="pug">
div(:class="styles.container")
  saturation(v-model="mixed")
  div(:class="styles.ctrlPane")
    div(:class="styles.row")
      div(:class="styles.previewCon")
        div(
          :class="styles.preview",
          :style="{background: `red`}"
        )
      div(:class="styles.barCon")
        ctrl(:class="styles.hue",   v-model="hue")
        ctrl(:class="styles.alpha", v-model="alpha")
</template>

<script>
import classnames from 'classnames';
import styles from './v-color.css';
const clsn = (...names) => classnames(names.map(n => styles[n]));

import saturation from './saturation.vue';
import ctrl from './ctrl.vue';

export default {
  name: 'v-color',
  components: { saturation, ctrl },
  data() {
    return {
      styles: {
        container: clsn('vcolor__container'),
        realtime: clsn('vcolor__preview'),
        ctrlPane: clsn('vcolor__ctrl__pane', 'vcolor__layout__table'),
        previewCon: clsn('vcolor__layout__cell', 'vcolor__preview__cell'),
        preview: clsn('vcolor__preview__circle'),
        barCon: clsn('vcolor__bar__container', 'vcolor__layout__cell'),
        row: clsn('vcolor__layout__row'),

        hue: clsn('vcolor__hue__bar'),
        alpha: clsn('vcolor__alpha__bar')
      },
      mixed: {},
      hue: {},
      alpha: {}
    };
  }
};
</script>
