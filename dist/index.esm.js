import throttle from 'lodash/throttle';
import clamp from 'lodash/clamp';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var browser = invariant;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var component = /-?\d+(\.\d+)?%?/g;
function extractComponents(color) {
  return color.match(component);
}

var extractComponents_1 = extractComponents;

var extractComponents$1 = /*#__PURE__*/Object.freeze({
  default: extractComponents_1,
  __moduleExports: extractComponents_1
});

function clamp$1(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

var clamp_1 = clamp$1;

var clamp$2 = /*#__PURE__*/Object.freeze({
  default: clamp_1,
  __moduleExports: clamp_1
});

var require$$0 = ( extractComponents$1 && extractComponents_1 ) || extractComponents$1;

var require$$1 = ( clamp$2 && clamp_1 ) || clamp$2;

var extractComponents$2 = require$$0;
var clamp$3 = require$$1;

function parseHslComponent(component, i) {
  component = parseFloat(component);

  switch(i) {
    case 0:
      return clamp$3(component, 0, 360);
    case 1:
    case 2:
      return clamp$3(component, 0, 100);
    case 3:
      return clamp$3(component, 0, 1);
  }
}

function hsl(color) {
  return extractComponents$2(color).map(parseHslComponent);
}

var hsl_1 = hsl;

var hsl$1 = /*#__PURE__*/Object.freeze({
  default: hsl_1,
  __moduleExports: hsl_1
});

function expand(hex) {
  var result = "#";

  for (var i = 1; i < hex.length; i++) {
    var val = hex.charAt(i);
    result += val + val;
  }

  return result;
}

function hex(hex) {
  // #RGB or #RGBA
  if(hex.length === 4 || hex.length === 5) {
    hex = expand(hex);
  }

  var rgb = [
    parseInt(hex.substring(1,3), 16),
    parseInt(hex.substring(3,5), 16),
    parseInt(hex.substring(5,7), 16)
  ];

  // #RRGGBBAA
  if (hex.length === 9) {
    var alpha = parseFloat((parseInt(hex.substring(7,9), 16) / 255).toFixed(2));
    rgb.push(alpha);
  }

  return rgb;
}

var hex_1 = hex;

var hex$1 = /*#__PURE__*/Object.freeze({
  default: hex_1,
  __moduleExports: hex_1
});

var extractComponents$3 = require$$0;
var clamp$4 = require$$1;

function parseRgbComponent(component, i) {
  if (i < 3) {
    if (component.indexOf('%') != -1) {
      return Math.round(255 * clamp$4(parseInt(component, 10), 0, 100)/100);
    } else {
      return clamp$4(parseInt(component, 10), 0, 255);
    }
  } else {
    return clamp$4(parseFloat(component), 0, 1);
  } 
}

function rgb(color) {
  return extractComponents$3(color).map(parseRgbComponent);
}

var rgb_1 = rgb;

var rgb$1 = /*#__PURE__*/Object.freeze({
  default: rgb_1,
  __moduleExports: rgb_1
});

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    { t2 = l * (1 + s); }
  else
    { t2 = l + s - l * s; }
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      { val = t1 + (t2 - t1) * 6 * t3; }
    else if (2 * t3 < 1)
      { val = t2; }
    else if (3 * t3 < 2)
      { val = t1 + (t2 - t1) * (2 / 3 - t3) * 6; }
    else
      { val = t1; }

    rgb[i] = val * 255;
  }

  return rgb;
}

var hsl2rgb_1 = hsl2rgb;

var require$$0$1 = ( hsl$1 && hsl_1 ) || hsl$1;

var require$$1$1 = ( hex$1 && hex_1 ) || hex$1;

var require$$2 = ( rgb$1 && rgb_1 ) || rgb$1;

var hsl$2 = require$$0$1;
var hex$2 = require$$1$1;
var rgb$2 = require$$2;
var hsl2rgb$1 = hsl2rgb_1;

function hsl2rgbParse(color) {
  var h = hsl$2(color);
  var r = hsl2rgb$1(h);

  // handle alpha since hsl2rgb doesn't know (or care!) about it
  if(h.length === 4) {
    r.push(h[3]);
  }

  return r;
}

var space2parser = {
  "#" : hex$2,
  "hsl" : hsl2rgbParse,
  "rgb" : rgb$2
};

function parse(color) {
  for(var scheme in space2parser) {
    if(color.indexOf(scheme) === 0) {
      return space2parser[scheme](color);
    }
  }
}

parse.rgb = rgb$2;
parse.hsl = hsl$2;
parse.hex = hex$2;

var index$1 = parse;

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    { s = 0; }
  else
    { s = (delta/max * 1000)/10; }

  if (max == min)
    { h = 0; }
  else if (r == max)
    { h = (g - b) / delta; }
  else if (g == max)
    { h = 2 + (b - r) / delta; }
  else if (b == max)
    { h = 4 + (r - g) / delta; }

  h = Math.min(h * 60, 360);

  if (h < 0)
    { h += 360; }

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

var rgb2hsv_1 = rgb2hsv;

var clamp$5 = require$$1;

function componentToHex(c) {
  var value = Math.round(clamp$5(c, 0, 255));
  var hex   = value.toString(16);

  return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(rgb) {
  var alpha = rgb.length === 4 ? componentToHex(rgb[3] * 255) : "";

  return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]) + alpha;
}

var rgb2hex_1 = rgb2hex;

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

var hsv2hsl_1 = hsv2hsl;

function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

var hsv2rgb_1 = hsv2rgb;

var toPrecision = function (num, precision) {
  var p = precision | 0;
  return p > 0 ? parseFloat(num.toFixed(p)) : num
};

var VueCtrlComponent = {
  name: 'v-ctrl',
  abstract: true,
  props: {
    direction: {
      type: String,
      default: 'h',
      validator: function validator (val) {
        return ['v', 'h', 'vh', 'hv'].indexOf(val) > -1
      }
    },
    throttle: {
      type: Number,
      default: 80
    },
    precision: {
      type: Number
    }
  },

  methods: {
    msdown: function msdown (e) {
      e.preventDefault();
      document.addEventListener('mousemove', this.msmove);
      document.addEventListener('mouseup', this.msup);
      this.next(e);
    },
  
    msmove: function msmove (e) {
      e.preventDefault();
      this.next(e);
    },
  
    msup: function msup (e) {
      this.next(e);
      document.removeEventListener('mousemove', this.msmove);
      document.removeEventListener('mouseup', this.msup);
    },
  
    notify: function notify (val) {
      if (isEqual(this.memo, val) === false) {
        this.memo = val;
        this.$emit('change', val);
      }
    },

    next: function next (ref) {
      if ( ref === void 0 ) { ref = {}; }
      var clientX = ref.clientX; if ( clientX === void 0 ) { clientX = 0; }
      var clientY = ref.clientY; if ( clientY === void 0 ) { clientY = 0; }

      var ref$1 = this;
      var direction = ref$1.direction;
      var adjust = ref$1.adjust;
      var rect = this.$el.getBoundingClientRect();

      var left = rect.left;
      var width = rect.width;
      var deltaX = clientX - left;
      var x = adjust(deltaX / width);

      if (direction === 'h') {
        return this.notify(x)
      }
  
      var top = rect.top;
      var height = rect.height;
      var deltaY = clientY - top;
      var y = adjust(deltaY / height);

      if (direction === 'v') {
        return this.notify(y)
      }

      // both direction
      this.notify([x, y]);
    },

    adjust: function adjust (num) {
      return toPrecision(clamp(num, 0, 1), this.precision)
    }
  },

  render: function render (h) {
    return this.$slots.default[0]
  },

  created: function created () {
    var ref = this;
    var msdown = ref.msdown;
    var msmove = ref.msmove;

    this.msdown = msdown.bind(this);
    this.msmove = throttle(msmove.bind(this), this.throttle);

    this.memo = null;
  },

  mounted: function mounted () {
    this.$el.addEventListener('mousedown', this.msdown);
  },

  destroyed: function destroyed () {
    this.$el.removeEventListener('mousedown', this.msdown);
  },

  install: function install () {
    Vue.component(VueCtrlComponent.name, VueCtrlComponent);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueCtrlComponent);
}

var index$2 = { VueCtrlComponent: VueCtrlComponent };

var colorModes = Object.freeze({
  rgba: ['r', 'g', 'b', 'a'],
  hsla: ['h', 's', 'l', 'a'],
  hex: ['hex']
});

var VColorComponent = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"cp__wrapper"},[_c('v-ctrl',{attrs:{"direction":"vh","precision":2,"throttle":80},on:{"change":_vm.onSaturationChange}},[_c('div',{staticClass:"cp__v-ctrl cp__saturation"},[_c('div',{staticClass:"msk-hue",style:(_vm.styles.saturationPane)}),_vm._v(" "),_c('div',{staticClass:"msk-white"}),_vm._v(" "),_c('div',{staticClass:"msk-black"}),_vm._v(" "),_c('p',{staticClass:"cp__thumb",style:(_vm.styles.saturationThumb)})])]),_vm._v(" "),_c('div',{staticClass:"cp__ctrl-pane"},[_c('div',[_c('div',{staticClass:"cp__preview"},[_c('div',{style:(_vm.styles.preview)})]),_vm._v(" "),_c('div',{staticClass:"cp__tracks"},[_c('v-ctrl',{attrs:{"direction":"h","precision":2,"throttle":80},on:{"change":_vm.onHueChange}},[_c('div',{staticClass:"cp__v-ctrl cp__ctrl-bar cp__ctrl-hue"},[_c('div',{staticClass:"cp__thumb",style:(_vm.styles.hueThumb)})])]),_vm._v(" "),_c('v-ctrl',{attrs:{"direction":"h","precision":2,"throttle":80},on:{"change":_vm.onAlphaChange}},[_c('div',{staticClass:"cp__v-ctrl cp__ctrl-alpha"},[_c('div',{staticClass:"cp__thumb",style:(_vm.styles.alphaThumb)}),_vm._v(" "),_c('div',{staticClass:"cp__ctrl-bar",style:(_vm.styles.alphaTrack)})])])],1)]),_vm._v(" "),_c('div',{staticStyle:{"margin-top":"10px"}},[_c('div',{staticClass:"cp__fm-fields"},_vm._l((_vm.colorModes[_vm.currentMode]),function(k){return _c('div',{key:k},[_c('div',{staticStyle:{"position":"relative"}},[_c('input',{attrs:{"type":_vm.constrains[k].type,"maxlength":_vm.constrains[k].maxlength},domProps:{"value":_vm.colorModel[k]},on:{"change":function($event){_vm.handleInput(k, $event);}}}),_vm._v(" "),_c('span',[_vm._v(_vm._s(k))])])])})),_vm._v(" "),_c('div',{staticClass:"cp__fm-switcher"},[_c('div',{on:{"click":function($event){_vm.changecurrentMode();}}},[_c('svg',{attrs:{"viewBox":"0 0 24 24"}},[_c('path',{attrs:{"fill":"#333","d":"M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"}}),_vm._v(" "),_c('path',{attrs:{"fill":"#333","d":"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z"}})])])])])])],1)},staticRenderFns: [],
  name: 'color-picker',
  props: {
    color: {
      type: String,
      default: '#ff0000'
    }
  },

  components: {
    'v-ctrl': index$2.VueCtrlComponent
  },

  data: function data () {
    var ref = this;
    var color = ref.color;

    var commonNumber = {
      type: 'number',
      maxlength: 3,
    };
    var percentValue = {
      type: 'string',
      maxlength: 4
    };

    return Object.assign({}, this.digestProp(color),
      {currentMode: getColorType(color),
      colorModes: colorModes,
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
      }})
  },

  watch: {
    color: {
      immediate: true,
      handler: function handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          index(this, this.digestProp(newVal));
        }
      }
    },
    rgba: {
      immediate: true,
      handler: function handler (newVal, oldVal) {
        if (("" + newVal) !== ("" + oldVal)) {
          this.emitChange();
        }
      }
    }
  },

  computed: {
    hsva: function hsva () {
      var ref = this;
      var hue = ref.hue;
      var alpha = ref.alpha;
      var ref_saturation = ref.saturation;
      var x = ref_saturation.x;
      var y = ref_saturation.y;
      return [
        hue * 360,
        x * 100,
        (1 - y) * 100,
        alpha
      ]
    },

    rgba: function rgba () {
      var ref = this;
      var alpha = ref.alpha;
      var hsva = ref.hsva;
      var ref$1 = hsv2rgb_1(hsva);
      var r = ref$1[0];
      var g = ref$1[1];
      var b = ref$1[2];
      return [
        Math.round(r),
        Math.round(g),
        Math.round(b),
        alpha
      ]
    },

    hsla: function hsla () {
      var ref = this;
      var alpha = ref.alpha;
      var hsva = ref.hsva;
      var ref$1 = hsv2hsl_1(hsva);
      var h = ref$1[0];
      var s = ref$1[1];
      var l = ref$1[2];
      return [
        Math.round(h),
        ((Math.round(s)) + "%"),
        ((Math.round(l)) + "%"),
        alpha
      ]
    },

    hex: function hex () {
      return rgb2hex_1(this.rgba)
    },

    previewBorderColor: function previewBorderColor () {
      var ref = this.rgba;
      var r = ref[0];
      var g = ref[1];
      var b = ref[2];
      if ((r + g + b) / 3 > 235) {
        return "rgba(160,160,160,0.8)"
      }
      return 'transparent'
    },

    styles: function styles () {
      var ref = this;
      var rgba = ref.rgba;
      var alpha = ref.alpha;
      var hue = ref.hue;
      var saturation = ref.saturation;
      var strRGB = rgba.slice(0, 3).join(', ');

      var strHueRGB = hsl2rgb_1([hue * 360, 100, 50])
        .map(function (v) { return Math.round(v); })
        .join(', ');

      return {
        preview: {
          backgroundColor: ("rgba(" + (rgba.join(', ')) + ")"),
          borderColor: this.previewBorderColor
        },
        saturationPane: {
          backgroundColor: ("rgb(" + strHueRGB + ")")
        },
        saturationThumb: {
          left: toPercent(saturation.x),
          top: toPercent(saturation.y)
        },
        alphaTrack: {
          backgroundImage: "linear-gradient(to right, " +
            "rgba(" + strRGB + ", 0) 0%, rgb(" + strRGB + ") 100%)"
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
    digestProp: function digestProp (val) {
      var rgba = index$1(val);
      var alpha = rgba[3] == null ? 1 : rgba[3];
      var ref = rgb2hsv_1(rgba);
      var hue = ref[0];
      var saturation = ref[1];
      var value = ref[2];

      // format of alpha: `.2f`
      // according to Chrome DevTool
      var _alpha = parseFloat(alpha.toFixed(2));

      return {
        alpha: _alpha,
        hue: hue / 360,
        saturation: {
          x: saturation / 100,
          y: 1 - value / 100
        }
      }
    },
    onSaturationChange: function onSaturationChange (ref) {
      var x = ref[0];
      var y = ref[1];

      this.saturation = { x: x, y: y };
    },
    onHueChange: function onHueChange (e) {
      this.hue = 1 - e;
    },
    onAlphaChange: function onAlphaChange (e) {
      // format of alpha: `.2f`
      // according to Chrome DevTool
      this.alpha = parseFloat(e.toFixed(2));
    },

    emitChange: function emitChange () {
      var ref = this;
      var alpha = ref.alpha;
      var hex = ref.hex;
      var rgba = ref.rgba;
      var hsla = ref.hsla;
      var hexVal = simplifyHex(
        alpha === 1 ? hex.slice(0, 7) : hex
      );

      this.$emit('change', {
        rgba: rgba,
        hsla: hsla,
        hex: hexVal
      });

      // this ensures that every component in
      // our model is up to date
      var h = hsla[0];
      var s = hsla[1];
      var l = hsla[2];
      var r = rgba[0];
      var g = rgba[1];
      var b = rgba[2];
      var shortHex = index(this.colorModel, {
        r: r, g: g, b: b, h: h, s: s, l: l,
        a: alpha,
        hex: hexVal
      });
    },

    changecurrentMode: function changecurrentMode () {
      var modes = Object.keys(this.colorModes);
      var index$$1 = modes.indexOf(this.currentMode);
      this.currentMode = modes[(index$$1 + 1) % modes.length];
    },

    handleInput: function handleInput (type, event) {
      var ref = this;
      var currentMode = ref.currentMode;
      var colorModel = ref.colorModel;
      var value = event.target.value;
      var num = Number(value);
      var changed = false;

      switch (type) {
        case 'a':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 1);
            changed = true;
          }
          break

        case 'r':
        case 'g':
        case 'b':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 255) | 0;
            changed = true;
          }
          break

        case 'h':
          if (colorModel[type] !== num && !isNaN(num)) {
            colorModel[type] = clamp(num, 0, 360) | 0;
            changed = true;
          }
          break

        case 's':
        case 'l':
          if (value.slice(-1) === '%' && colorModel[type] !== value) {
            num = parseFloat(value);
            colorModel[type] = (clamp(num, 0, 360) | 0) + "%";
            changed = true;
          }
          break

        case 'hex':
          if (value[0] === '#') {
            if (colorModel[type] !== value && index$1(value).every(function (i) { return !isNaN(i); })) {
              colorModel[type] = simplifyHex(value);
              changed = true;
            }
          }
          break
      }

      if (changed) {
        var h = colorModel.h;
        var s = colorModel.s;
        var l = colorModel.l;
        var r = colorModel.r;
        var g = colorModel.g;
        var b = colorModel.b;
        var a = colorModel.a;
        var hex = colorModel.hex;
        var literal = hex;

        if (currentMode === 'rgba') {
          literal = "rgba(" + ([r, g, b, a]) + ")";
        } else if (currentMode === 'hsla') {
          literal = "hsla(" + ([h, s, l, a]) + ")";
        }

        index(this, this.digestProp(literal));
      }
    }
  },

  created: function created () {
    this.handleInput = debounce(this.handleInput.bind(this), 50);
  }
}

function toPercent (n, precision) {
  if ( precision === void 0 ) precision = 3;

  // eslint-disable-next-line
  var num = (n * 100).toPrecision(precision | 0);
  return (num + "%")
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

  browser(false, (color + " is not valid color value!"));
}

function simplifyHex (val) {
  return val.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f]?)\4$/, '#$1$2$3$4')
}

VColorComponent.install = function (Vue) {
  Vue.config.devtools = "production" !== 'production';
  Vue.component(VColorComponent.name, VColorComponent);
};

export default VColorComponent;
//# sourceMappingURL=index.esm.js.map
