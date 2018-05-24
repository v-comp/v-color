<template>
  <div class="cp__wrapper">
    <v-ctrl
      direction="vh"
      :precision="2"
      :throttle="80"
      @change="onSaturationChange"
    >
      <div class="cp__v-ctrl cp__saturation">
        <div class="msk-hue" :style="styles.saturationPane"></div>
        <div class="msk-white"></div>
        <div class="msk-black"></div>
        <p class="cp__thumb" :style="styles.saturationThumb"></p>
      </div>
    </v-ctrl>

    <div class="cp__ctrl-pane">
      <div>
        <div class="cp__preview">
          <div :style="styles.preview"></div>
        </div>

        <div class="cp__tracks">
          <v-ctrl
            direction="h"
            :precision="2"
            :throttle="80"
            @change="onHueChange"
          >
            <div class="cp__v-ctrl cp__ctrl-bar cp__ctrl-hue">
              <div class="cp__thumb" :style="styles.hueThumb"></div>
            </div>
          </v-ctrl>

          <v-ctrl
            direction="h"
            :precision="2"
            :throttle="80"
            @change="onAlphaChange"
          >
            <div class="cp__v-ctrl cp__ctrl-alpha">
              <div class="cp__thumb" :style="styles.alphaThumb"></div>
              <div class="cp__ctrl-bar" :style="styles.alphaTrack"></div>
            </div>
          </v-ctrl>
        </div>
      </div>

      <div style="margin-top: 10px">
        <div class="cp__fm-fields">
          <div style="padding-left: 6px; width: 100%;" v-for="k in colorModes[currentMode]" :key="k">
            <div style="position: relative;">
              <input
                @input="handleInput(k, $event)"
                :value="colorModel[k]"
                :type="constrains[k].type"
                :maxlength="constrains[k].maxlength"
              >
              <span>{{k}}</span>
            </div>
          </div>
        </div>

        <div class="cp__fm-switcher">
          <div @click="changecurrentMode()">
            <svg viewBox="0 0 24 24">
              <path fill="#333" d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
              <path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z" />
            </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clamp from 'lodash/clamp'
import debounce from 'lodash/debounce'

import invariant from 'invariant'
import objectAssign from 'object-assign'

import parse2rgb from 'pure-color/parse'
import rgb2hsv from 'pure-color/convert/rgb2hsv'
import rgb2hex from 'pure-color/convert/rgb2hex'
import hsv2hsl from 'pure-color/convert/hsv2hsl'
import hsv2rgb from 'pure-color/convert/hsv2rgb'
import hsl2rgb from 'pure-color/convert/hsl2rgb'

import VCtrl from 'v-ctrl'

import './color-picker.css'

const colorModes = Object.freeze({
  rgba: ['r', 'g', 'b', 'a'],
  hsla: ['h', 's', 'l', 'a'],
  hex: ['hex']
})

export default {
  name: 'color-picker',
  props: {
    color: {
      type: String,
      default: '#ff0000'
    }
  },

  components: {
    'v-ctrl': VCtrl.VueCtrlComponent
  },

  data () {
    const { color } = this

    const commonNumber = {
      type: 'number',
      maxlength: 3,
    }
    const percentValue = {
      type: 'string',
      maxlength: 4
    }

    return {
      ...this.digestProp(color),
      currentMode: getColorType(color),
      colorModes,
      colorModel: {
        hex: '',
        r: '',
        g: '',
        b: '',
        h: '',
        s: '',
        l: '',
        a: ''
      },
      constrains: {
        r: commonNumber,
        g: commonNumber,
        b: commonNumber,
        h: commonNumber,
        s: percentValue,
        l: percentValue,
        a: {
          type: 'number',
          maxlength: 4
        },
        hex: {
          type: 'string',
          maxlength: 9
        }
      }
    }
  },

  watch: {
    color: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          objectAssign(this, this.digestProp(newVal))
        }
      }
    },
    rgba: {
      immediate: true,
      handler (newVal, oldVal) {
        if (`${newVal}` !== `${oldVal}`) {
          this.emitChange()
        }
      }
    }
  },

  computed: {
    hsva () {
      const { hue, alpha, saturation: { x, y } } = this
      return [
        hue * 360,
        x * 100,
        (1 - y) * 100,
        alpha
      ]
    },

    rgba () {
      const { alpha, hsva } = this
      const [r, g, b] = hsv2rgb(hsva)
      return [
        Math.round(r),
        Math.round(g),
        Math.round(b),
        alpha
      ]
    },

    hsla () {
      const { alpha, hsva } = this
      const [h, s, l] = hsv2hsl(hsva)
      return [
        Math.round(h),
        `${Math.round(s)}%`,
        `${Math.round(l)}%`,
        alpha
      ]
    },

    hex () {
      return rgb2hex(this.rgba)
    },

    previewBorderColor () {
      const [r, g, b] = this.rgba
      if ((r + g + b) / 3 > 235) {
        return `rgba(160,160,160,0.8)`
      }
      return 'transparent'
    },

    styles () {
      const { rgba, alpha, hue, saturation } = this
      const strRGB = rgba.slice(0, 3).join(', ')

      const strHueRGB = hsl2rgb([hue * 360, 100, 50])
        .map(v => Math.round(v))
        .join(', ')

      return {
        preview: {
          backgroundColor: `rgba(${rgba.join(', ')})`,
          borderColor: this.previewBorderColor
        },
        saturationPane: {
          backgroundColor: `rgb(${strHueRGB})`
        },
        saturationThumb: {
          left: toPercent(saturation.x),
          top: toPercent(saturation.y)
        },
        alphaTrack: {
          backgroundImage: `linear-gradient(to right, ` +
            `rgba(${strRGB}, 0) 0%, rgb(${strRGB}) 100%)`
        },
        alphaThumb: {
          left: toPercent(alpha)
        },
        hueThumb: {
          left: toPercent(1 - hue)
        }
      }
    }
  },

  methods: {
    digestProp (val) {
      const rgba = parse2rgb(val)
      const alpha = rgba[3] == null ? 1 : rgba[3]
      const [hue, saturation, value] = rgb2hsv(rgba)

      // format of alpha: `.2f`
      // according to Chrome DevTool
      const _alpha = parseFloat(alpha.toFixed(2))

      return {
        alpha: _alpha,
        hue: hue / 360,
        saturation: {
          x: saturation / 100,
          y: 1 - value / 100
        }
      }
    },
    onSaturationChange ([x, y]) {
      this.saturation = { x, y }
    },
    onHueChange (e) {
      this.hue = 1 - e
    },
    onAlphaChange (e) {
      // format of alpha: `.2f`
      // according to Chrome DevTool
      this.alpha = parseFloat(e.toFixed(2))
    },

    emitChange () {
      const { alpha, hex, rgba, hsla } = this
      const hexVal = alpha === 1 ? hex.slice(0, 7) : hex

      this.$emit('change', {
        rgba,
        hsla,
        hex: hexVal
      })

      // this ensures that every component in
      // our model is up to date
      const [h, s, l] = hsla
      const [r, g, b] = rgba
      objectAssign(this.colorModel, { r, g, b, h, s, l, hex: hexVal, a: alpha })
    },

    changecurrentMode () {
      const modes = Object.keys(this.colorModes)
      const index = modes.indexOf(this.currentMode)
      this.currentMode = modes[(index + 1) % modes.length]
    },

    handleInput (type, event) {
      const { currentMode, colorModel } = this
      const { target: { value } } = event
      let num = (type === 's' || type === 'l') ? parseFloat(value) : Number(value)
      let changed = false

      switch (isNaN(num) || type) {
        case 'a':
          if (colorModel[type] !== num) {
            colorModel[type] = clamp(num, 0, 1)
            changed = true
          }
          break

        case 'r':
        case 'g':
        case 'b':
          if (colorModel[type] !== num) {
            colorModel[type] = clamp(num, 0, 255) | 0
            changed = true
          }
          break

        case 'h':
          if (colorModel[type] !== num) {
            colorModel[type] = clamp(num, 0, 360) | 0
            changed = true
          }
          break

        case 's':
        case 'l':
          if (value.slice(-1) === '%' && colorModel[type] !== value) {
            colorModel[type] = `${ clamp(num, 0, 360) | 0 }%`
            changed = true
          }
          break

        case 'hex':
          if (value[0] === '#') {
            if (colorModel[type] !== value && parse2rgb(value).every(i => !isNaN(i))) {
              colorModel[type] = value
              changed = true
            }
          }
          break
      }

      if (changed) {
        const { h, s, l, r, g, b, a, hex } = colorModel
        let literal = hex

        if (currentMode === 'rgba') {
          literal = `rgba(${ [r, g, b, a] })`
        } else if (currentMode === 'hsla') {
          literal = `hsla(${ [h, s, l, a] })`
        }

        objectAssign(this, this.digestProp(literal))
      }
    }
  },

  created () {
    this.handleInput = debounce(this.handleInput.bind(this), 200)
  }
}

function toPercent (n, precision = 3) {
  // eslint-disable-next-line
  const num = (n * 100).toPrecision(precision | 0)
  return `${num}%`
}

function getColorType (color) {
  if (color[0] === '#') {
    return 'hex'
  }

  if (color.indexOf('rgb') === 0) {
    return 'rgba'
  }

  if (color.indexOf('hsl') === 0) {
    return 'hsla'
  }

  invariant(false, `${color} is not valid color value!`)
}
</script>
