<template lang="pug">
div(:class="styles.container")
  saturation(v-model="mixed", :bgcolor="hueColor")

  div(:class="styles.ctrlPane")
    div(:class="styles.flexRow")
      div(:class="styles.previewCon")
        div(:class="styles.preview")
          div(:style="{background: preview}")
      div(:class="styles.barCon")
        ctrl(:class="styles.hue",   v-model="hue")
        ctrl(:class="styles.alpha", v-model="alpha")
          div(:style="{background: gradientAlpha}")
    fields(:prop="realtime", @change="digestHSVA($event)")
</template>

<script>
import {
  clsn,
  parseColor
} from './utils';

import hsl2rgb from 'pure-color/convert/hsl2rgb';
import hsv2rgb from 'pure-color/convert/hsv2rgb';
import hsv2hsl from 'pure-color/convert/hsv2hsl';
const nums2color = vals => vals.map(n => n | 0).join(',');
const float = num => parseFloat(num) || 0;

import saturation from './saturation.vue';
import fields from './fields.vue';
import ctrl from './ctrl.vue';

export default {
  name: 'v-color',
  components: { saturation, ctrl, fields },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    const hsva = parseColor(this.value);
    const {
      hue,
      mixed,
      alpha
    } = this._digest(hsva);

    return {
      styles: {
        container: clsn('container'),
        flexRow: clsn('flex-row'),
        ctrlPane: clsn('ctrl-pane'),
        previewCon: clsn('layout-cell', 'preview-cell'),
        preview: clsn('preview-circle'),
        barCon: clsn('bar-container'),
        hue: clsn('hue-bar'),
        alpha: clsn('alpha-bar'),
        formats: clsn('formats-inputs'),
        fmSwitch: clsn('format-switch')
      },
      hsva,
      mixed,
      hue,
      alpha
    };
  },
  computed: {
    realtime() {
      const hsv = [
        float(this.hue.left) * 3.6 || 0,
        float(this.mixed.left),
        -float(this.mixed.top) + 100
      ];
      const [r, g, b] = hsv2rgb(hsv).map(i => i | 0);
      const [h, s, l] = hsv2hsl(hsv).map(i => i | 0);
      const a = float((float(this.alpha.left) / 100).toFixed(2));
      const hex = '#' + [r, g, b].map(i => `0${i.toString(16)}`.slice(-2)).join('');
      return {
        r,
        g,
        b,
        h,
        s,
        l,
        a,
        hex
      };
    },
    preview() {
      const { r, g, b, a } = this.realtime;
      return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;
    },
    hueColor() {
      const hsl = [
        float(this.hue.left) * 3.6,
        100,
        50
      ];
      const [r, g, b] = hsl2rgb(hsl).map(i => i | 0);
      return `rgb(${nums2color([r, g, b])})`;
    },
    gradientAlpha() {
      const { r, g, b } = this.realtime;
      const rgb = nums2color([r, g, b]);
      return `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgb(${rgb}) 100%)`;
    }
  },
  watch: {
    value(val) {
      this.hsva = parseColor(val);
      this.digestHSVA(this.hsva);
    },
    preview(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    _digest(hsva) {
      const [h, s, v, a] = hsva;
      return {
        hue: {
          left: h / 3.6 + '%'
        },
        mixed: {
          left: s + '%',
          top: (100 - v) + '%'
        },
        alpha: {
          left: a * 100 + '%'
        }
      };
    },
    digestHSVA(hsva) {
      const {
        hue,
        mixed,
        alpha
      } = this._digest(hsva);

      this.hue = hue;
      this.mixed = mixed;
      this.alpha = alpha;
    }
  },
  created() {
    this.digestHSVA(this.hsva);
  }
};
</script>
