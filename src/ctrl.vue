<template lang="pug">
div(:class="styles.bar", ref="bar", v-stream:mousedown="mousedown$")
  slot
  div(:class="styles.ctrl", :style="pointerPos")
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
const untilMouseUp = () => {
  return Observable
    .fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
};

export default {
  name: 'v-color-ctrl',
  props: {
    value: {
      type: Object,
      default: {
        top: 0,
        left: 0
      }
    },
    dir: {
      type: ['both', 'v', 'h'],
      default: 'h'
    }
  },
  data() {
    return {
      styles: {
        bar: clsn('vcolor__ctrl__bar'),
        ctrl: clsn(
          'vcolor__ctrl__circle',
          this.dir === 'both' ? 'vcolor__ctrl__circle__transparent' : ''
        )
      }
    };
  },
  domStreams: ['mousedown$'],
  subscriptions() {
    const selector = `.${clsn('vcolor__ctrl__circle')}`;
    const resultByDir = (res) => {
        const dir = this.dir;
        const left = percent(res.left);
        const top = percent(res.top);
        if (dir === 'both') {
          return { top, left };
        } else if (dir === 'v') {
          return { top };
        } else {
          return { left };
        }
    };
    const circle$ = this.$fromDOMEvent(selector, 'mousedown');
    const mousedown$ = this.mousedown$.map(e => e.event);
    const change$ = circle$.merge(mousedown$)
      .switchMap(untilMouseUp)
      .merge(mousedown$)
      .do(e => e.preventDefault())
      .map(e => ({x: e.clientX, y: e.clientY}))
      .throttleTime(100)
      .map(this.calcProportion);
    return {
      pointerPos: change$
        .map(resultByDir)
        .do(res => this.$emit('input', res))
    };
  },
  methods: {
    calcProportion(e) {
      const { x, y } = e;
      const r = this.$refs.bar.getBoundingClientRect();
      return {
        left: limit01((x - r.left) / r.width),
        top:  limit01((y - r.top)  / r.height)
      };
    }
  }
};
</script>
