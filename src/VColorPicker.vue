<template>
  <div class="wrapper">
    <v-ctrl
      direction="vh"
      :precision="2"
      :throttle="80"
      @change="onSaturationChange"
    >
      <div class="saturation">
        <div class="mask hue" :style="styles.saturationPane"></div>
        <div class="mask white"></div>
        <div class="mask black"></div>
        <p class="thumb" :style="styles.saturationThumb"></p>
      </div>
    </v-ctrl>

    <section class="controls">
      <section class="sliders">
        <v-ctrl
          direction="h"
          :precision="2"
          :throttle="80"
          @change="onHueChange"
        >
          <div class="slider bar hue">
            <div class="thumb" :style="styles.hueThumb"></div>
          </div>
        </v-ctrl>
        <v-ctrl
          direction="h"
          :precision="2"
          :throttle="80"
          @change="onAlphaChange"
        >
          <div class="slider alpha">
            <div class="thumb" :style="styles.alphaThumb"></div>
            <div class="bar" :style="styles.alphaTrack"></div>
          </div>
        </v-ctrl>
      </section>

      <section class="modes">
        <select
          v-model="currentMode"
          class="mode-input select"
        >
          <option
            v-for="(_, key) in colorModes"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>
        <input
          v-for="k in colorModes[currentMode]"
          :key="k"
          class="mode-input"
          :value="colorModel[k]"
          :type="constrains[k].type"
          :maxlength="constrains[k].maxlength"
          @input="handleInput(k, $event)"
        />
      </section>
    </section>

    <section
      v-if="withSuggestions && suggestions.length > 0"
      class="suggestions"
    >
      <p>Previously used colors</p>
      <ul>
        <li v-for="color in suggestions" :key="color">
          <button
            type="button"
            class="suggestion"
            :style="{ backgroundColor: color }"
            @click="onClickColor(color)"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import clamp from 'lodash/clamp'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'

import invariant from 'invariant'
import objectAssign from 'object-assign'

import parse2rgb from 'pure-color/parse'
import rgb2hsv from 'pure-color/convert/rgb2hsv'
import rgb2hex from 'pure-color/convert/rgb2hex'
import hsv2hsl from 'pure-color/convert/hsv2hsl'
import hsv2rgb from 'pure-color/convert/hsv2rgb'
import hsl2rgb from 'pure-color/convert/hsl2rgb'

import VCtrl from 'v-ctrl'

const colorModes = Object.freeze({
  rgba: ['r', 'g', 'b', 'a'],
  hsla: ['h', 's', 'l', 'a'],
  hex: ['hex']
})

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

function simplifyHex (val) {
  return val.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f]?)\4$/, '#$1$2$3$4')
}

export default {
  name: 'VColorPicker',

  props: {
    value: {
      type: String,
      default: '#ff0000',
    },
    withSuggestions: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    'v-ctrl': VCtrl.VueCtrlComponent
  },

  data () {
    const { value } = this
    const commonNumber = {
      type: 'number',
      maxlength: 3,
    }
    const percentValue = {
      type: 'string',
      maxlength: 4
    }

    return {
      ...this.digestProp(value),
      suggestions: [],
      currentMode: getColorType(value),
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
    value: {
      immediate: true,
      handler (val, oldVal) {
        if (val === oldVal) return

        objectAssign(this, this.digestProp(val))
      }
    },
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
    digestProp(val) {
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
      this.emitChange()
    },
    onHueChange (e) {
      this.hue = 1 - e
      this.emitChange()
    },
    onAlphaChange (e) {
      // format of alpha: `.2f`
      // according to Chrome DevTool
      this.alpha = parseFloat(e.toFixed(2))
      this.emitChange()
    },
    emitChange () {
      const { hex, rgba, hsla, currentMode } = this

      this.updateColorModel()

      if (currentMode === 'hex') {
        this.updateSuggestions(hex)
        this.$emit('input', hex)
      } else if (currentMode === 'hsla') {
        const color = `hsla(${hsla.join(',')})`

        this.updateSuggestions(color)
        this.$emit('input', color)
      } else if (currentMode === 'rgba') {
        const color = `rgba(${rgba.join(',')})`

        this.updateSuggestions(color)
        this.$emit('input', color)
      }


    },
    onClickColor(color) {
      this.$emit('input', color)
    },
    handleInput (type, event) {
      const { currentMode, colorModel } = this
      const { target: { value } } = event
      let num = Number(value)
      let changed = false

      switch (type) {
        case 'a':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 1)
            changed = true
          }
          break
        case 'r':
        case 'g':
        case 'b':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 255) | 0
            changed = true
          }
          break
        case 'h':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 360) | 0
            changed = true
          }
          break
        case 's':
        case 'l':
          if (value.slice(-1) === '%' && colorModel[type] !== value) {
            num = parseFloat(value)
            colorModel[type] = `${ clamp(num, 0, 360) | 0 }%`
            changed = true
          }
          break
        case 'hex':
          if (value[0] === '#') {
            if (colorModel[type] !== value && parse2rgb(value).every(i => !isNaN(i))) {
              colorModel[type] = simplifyHex(value)
              changed = true
            }
          }
          break
      }

      if (!changed) return

      const { h, s, l, r, g, b, a, hex } = colorModel
      let literal = hex

      if (currentMode === 'rgba') {
        literal = `rgba(${ [r, g, b, a] })`
      } else if (currentMode === 'hsla') {
        literal = `hsla(${ [h, s, l, a] })`
      }

      objectAssign(this, this.digestProp(literal))
      this.emitChange()
    },
    updateColorModel() {
      const { hsla, rgba, hex, alpha } = this
      const [h, s, l] = hsla
      const [r, g, b] = rgba
      const hexVal = simplifyHex(
        alpha === 1 ? hex.slice(0, 7) : hex
      )
      objectAssign(this.colorModel, {
        r, g, b, h, s, l,
        a: alpha,
        hex: hexVal,
      })
    },
    loadSuggestions() {
      const suggestions = localStorage.getItem('V_COLOR_PICKER_SUGGESTIONS')

      if (!suggestions) return []

      this.suggestions = JSON.parse(suggestions)
    },
    updateSuggestions(color) {
      if (this.suggestions.includes(color)) return

      let updatedSuggestions

      if (this.suggestions.length < 7) {
        updatedSuggestions = this.suggestions.concat(color)
      } else {
        updatedSuggestions = this.suggestions.slice(1, 7).concat(color)
      }

      this.suggestions = updatedSuggestions
      localStorage.setItem('V_COLOR_PICKER_SUGGESTIONS', JSON.stringify(updatedSuggestions))
    }
  },

  created () {
    this.handleInput = debounce(this.handleInput.bind(this), 250)
    this.emitChange = debounce(this.emitChange.bind(this), 250)

    this.updateColorModel()
    this.loadSuggestions()
  }
}
</script>

<style lang="postcss" scoped>
.wrapper {
  width: 260px;
  margin: 0;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.slider {
  position: relative;
  margin-bottom: 16px;

  &.hue {
    background: linear-gradient(-90deg, red, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
  }

  &.alpha {
    margin-top: 8px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==) left center;
  }
}

.bar {
  height: 8px;
  border-radius: 4px;
}

.controls {
  padding: 20px 16px;
  padding-bottom: 16px;
}

.modes {
  display: flex;
  align-items: center;
}

.mode-input {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  text-transform: uppercase;
  border: none;
  padding: 0;
  font-family: Inter, Helvetica, Arial, sans-serif;
  color: #1A202C;
}

.mode-input.select {
  flex: 0 0 42px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 6px;
  background-position: center right;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOCA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMSAxLjQ3MzM5TDQgNC41MjY2Nkw3IDEuNDczMzkiIHN0cm9rZT0iIzlFQjVDOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=');
}

.thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  top: 0;
  border-radius: 50%;
  margin-top: -1px;
  transform: translateX(-50%);
  background-color: #f8f8f8;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.368627);
  cursor: default;
}


.saturation {
  position: relative;
  width: 100%;
  padding-bottom: 55%;
  overflow: hidden;

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
  }

  & > .thumb {
    background-color: transparent;
    transform: translate(-50%, -50%);
    box-shadow:
      0 0 0 1.5px #fff,
      inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
      0 0 1px 2px rgba(0, 0, 0, 0.4);
  }
}

.mask {
  &.white {
    background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
  }

  &.black {
    background: linear-gradient(0deg, #000, transparent);
  }
}

.suggestions {
  border-top: 1px solid #E2E8F0;
  padding: 20px 16px;
  padding-top: 16px;
}

.suggestions p {
  margin-top: 0;
  margin-bottom: 10px;
  font-family: Inter, Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #1A202C;
}

.suggestions ul {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.suggestion {
  width: 24px;
  height: 24px;
  margin: 4px;
  border: 1px solid #E2E8F0;
  border-radius: 50%;
}
</style>
