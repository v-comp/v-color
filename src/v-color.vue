<template lang="pug">
div(:class="styles.container")
  saturation(v-model="mixed", :bgcolor="hueColor")
  div(:class="styles.ctrlPane")
    div(:class="styles.row")
      div(:class="styles.previewCon")
        div(:class="styles.preview", :style="{background: realTime}")
      div(:class="styles.barCon")
        ctrl(:class="styles.hue",   v-model="hue")
        ctrl(:class="styles.alpha", v-model="alpha")
          div(
            :class="styles.alphaBand",
            :style="{background: gradientAlpha}"
          )
</template>

<script>
//  
import classnames from 'classnames';
import styles from './v-color.css';
const clsn = (...names) => classnames(names.map(n => styles[n]));

import hsl2rgb from 'pure-color/convert/hsl2rgb';
import hsv2rgb from 'pure-color/convert/hsv2rgb';
const nums2color = vals => vals.map(n => n | 0).join(',');

import saturation from './saturation.vue';
import ctrl from './ctrl.vue';

export default {
  name: 'v-color',
  components: { saturation, ctrl },
  data() {
    return {
      styles: {
        container: clsn('container'),
        realtime: clsn('preview'),
        ctrlPane: clsn('ctrl-pane', 'layout-table'),
        previewCon: clsn('layout-cell', 'preview-cell'),
        preview: clsn('preview-circle'),
        barCon: clsn('bar-container', 'layout-cell'),
        row: clsn('layout-row'),

        hue: clsn('hue-bar'),
        alpha: clsn('alpha-bar'),
        alphaBand: clsn('alpha-band')
      },
      mixed: {},
      hue: {},
      alpha: {}
    };
  },
  computed: {
    hueColor() {
      const hsl = [parseFloat(this.hue.left || 0) * 3.6, 100, 50];
      return `rgb(${nums2color(hsl2rgb(hsl))})`;
    },
    realTime() {
      const { raw } = this.rgbColor;
      const alpha = parseFloat(this.alpha.left || 0) / 100;
      return `rgba(${raw}, ${alpha})`;
    },
    rgbColor() {
      const hsv = [
        parseFloat(this.hue.left || 0) * 3.6,
        parseFloat(this.mixed.left || 0),
        100 - parseFloat(this.mixed.top || 0),
      ];
      const raw = nums2color(hsv2rgb(hsv));
      return {
        rgb: `rgb(${raw})`,
        raw: raw
      }
    },
    gradientAlpha() {
      const { raw } = this.rgbColor;
      return `linear-gradient(to right, rgba(${raw}, 0) 0%, rgb(${raw}) 100%)`;
    }
  }
};
</script>
