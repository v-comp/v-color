<template lang="pug">
div(:class="styles.flexRow")
  div(:class="styles.formats")
    div(style="padding-left: 6px; width: 100%;", v-for="v in modes[mode]")
      div(style="position: relative;")
        input(@change="onFieldChange(v, $event)", v-model="rgbhsla[v]")
        span {{v}}

  div(:class="styles.fmSwitch")
    div(@click="changeMode(+1)")
      svg(viewBox="0 0 24 24")
        path(fill="#333", d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z")
        path(fill="#333", d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z")
</template>
<script>
import {
  clsn,
  extend
} from './utils';

import rgb2hsv from 'pure-color/convert/rgb2hsv';
import hex2rgb from 'pure-color/parse/hex';
import hsl2rgb from 'pure-color/convert/hsl2rgb';
import rgb2hsl from 'pure-color/convert/rgb2hsl';
import rgb2hex from 'pure-color/convert/rgb2hex';
const hsl2hex = (hsl) => rgb2hex(hsl2rgb(hsl));

const range = (num, min, max) => {
  return Math.min(max, Math.max(min, +num));
};

export default {
  name: 'v-color-fields',
  props: {
    prop: {
      type: String,
      required: true
    }
  },
  data() {
    const { prop } = this;
    const rgbhsla = this.digestProp(prop);
    return {
      styles: {
        flexRow: clsn('flex-row'),
        formats: clsn('formats-inputs'),
        fmSwitch: clsn('format-switch')
      },
      mode: 'rgba',
      rgbhsla,
      _rgbhsla: rgbhsla
    };
  },
  computed: {
    modes() {
      const base = {
        rgba: ['r', 'g', 'b', 'a'],
        hsla: ['h', 's', 'l', 'a']
      };
      if (+this.rgbhsla.a === 1) {
        base.hex = ['hex'];
      }
      return base;
    }
  },
  watch: {
    prop(val) {
      this.rgbhsla = this.digestProp(val);
      this._rgbhsla = extend({}, this.rgbhsla);
    }
  },
  methods: {
    digestProp(prop) {
      if (prop.a < 1 && this.mode === 'hex') {
        this.mode = 'rgba';
      }
      return extend({}, prop);
    },

    computeVals() {
      const mode = this.mode;
      const rgbhsla = this.rgbhsla;
      const vals = this.modes[mode].map(k => rgbhsla[k]);

      switch (mode) {
        case 'hex':
          const [_r, _g, _b] = hex2rgb(rgbhsla['hex']);
          const [_h, _s, _l] = rgb2hsl([_r, _g, _b]);
          rgbhsla['r'] = Math.round(_r);
          rgbhsla['g'] = Math.round(_g);
          rgbhsla['b'] = Math.round(_b);
          rgbhsla['h'] = Math.round(_h);
          rgbhsla['s'] = Math.round(_s);
          rgbhsla['l'] = Math.round(_l);
          break;
        case 'rgba':
          const [h, s, l] = rgb2hsl(vals);
          rgbhsla['h'] = Math.round(h);
          rgbhsla['s'] = Math.round(s);
          rgbhsla['l'] = Math.round(l);
          rgbhsla['hex'] = hsl2hex([h, s, l]);
          break;
        case 'hsla':
          const [r, g, b] = hsl2rgb(vals);
          rgbhsla['r'] = Math.round(r);
          rgbhsla['g'] = Math.round(g);
          rgbhsla['b'] = Math.round(b);
          rgbhsla['hex'] = rgb2hex([r, g, b]);
          break;
      }
    },

    onFieldChange(key, e) {
      let val = e.target.value;

      switch (key) {
        case 'hex':
          const match = val.match(/^\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/);
          if (match) {
            val = match[1].trim();
          } else {
            val = this._rgbhsla.hex;
          }

          this.rgbhsla['a'] = 1;
          break;

        case 'a':
          val = range(val, 0, 1);
          break;

        case 'r':
        case 'g':
        case 'b':
          val = range(val, 0, 255);
          break;

        case 'h':
          val = range(val, 0, 360);
          break;

        case 's':
        case 'l':
          val = range(val, 0, 100);
          break;
      }

      this.rgbhsla[key] = val;
      if (key !== 'a') {
        this.computeVals();
      }
      this._rgbhsla = extend({}, this.rgbhsla);
      const { r, g, b, a } = this._rgbhsla;
      this.$emit('change', rgb2hsv([r, g, b]).concat(a));
    },

    changeMode(incr) {
      const modes = Object.keys(this.modes);
      const index = modes.indexOf(this.mode);
      const next = (index + incr) % modes.length;
      this.mode = modes[next < 0 ? modes.length - 1 : next];
    }
  }
};
</script>

