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
          class="mode-input"
          :style="{ width: '60px' }"
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
          :style="{ width: `calc((100% - 60px) / ${colorModes[currentMode].length})` }"
          :value="colorModel[k]"
          :type="constrains[k].type"
          :maxlength="constrains[k].maxlength"
          @input="handleInput(k, $event)"
        />
      </section>
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
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: '#ff0000',
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
    rgba: {
      immediate: true,
      handler (val, oldVal) {
        if (isEqual(val, oldVal)) return

        this.emitChange()
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
      const { alpha, hex, rgba, hsla, currentMode } = this
      const hexVal = simplifyHex(
        alpha === 1 ? hex.slice(0, 7) : hex
      )

      switch (currentMode) {
        case 'hex':
          this.$emit('input', hex)
          break
        case 'hsla':
          this.$emit('input', `hsla(${hsla.join(',')})`)
          break
        case 'rgba':
          this.$emit('input', `rgba(${rgba.join(',')})`)
          break
      }

      // this ensures that every component in
      // our model is up to date
      const [h, s, l] = hsla
      const [r, g, b] = rgba
      const shortHex = objectAssign(this.colorModel, {
        r, g, b, h, s, l,
        a: alpha,
        hex: hexVal
      })
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
    this.handleInput = debounce(this.handleInput.bind(this), 50)
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
}

.modes {
  display: flex;
  align-items: center;
}

.mode-input {
  flex: 1 1 auto;
  width: auto;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  text-transform: uppercase;
  border: none;
  padding: 0;
  font-family: Inter, Helvetica, Arial, sans-serif;
  color: #1A202C;
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
</style>
