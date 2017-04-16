'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var arguments$1 = arguments;

		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments$1[i];
			if (!arg) { continue; }

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ('object' !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
		// register as 'classnames', consistent with npm package name
		undefined('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());
});

var styles = __$styleInject("._heading_atf7u_1{font-size:26px}._heading-primary_atf7u_4{color:#333}",{"heading":"_heading_atf7u_1","heading-primary":"_heading-primary_atf7u_4"});

var VColorComponent$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('h1',{class:_vm.styles.heading},[_vm._v(_vm._s(_vm.text))])},staticRenderFns: [],
  name: 'v-color',
  props: {
    text: String
  },
  data: function data() {
    return {
      styles: {
        heading: index(styles['heading'], styles['heading-primary'])
      }
    };
  }
};

VColorComponent$1.install =  function (Vue) {
  Vue.component(VColorComponent$1.name, VColorComponent$1 );
};

module.exports = VColorComponent$1;
//# sourceMappingURL=v-color.common.js.map
