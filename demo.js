import ColorPicker from './src/index'
window.Vue.use(ColorPicker)

window.vm = new window.Vue({
  el: '#app',
  template: `
    <div style="display: flex;">
      <div style="margin-right: 36px">
        <color-picker v-model="hex" />
        <div :style="{
          width: '180px',
          height: '40px',
          'line-height': '40px',
          'text-align': 'center',
          margin: '20px auto 0',
          color: 'white',
          'background-color': hex,
          'border-radius': '20px',
          'font-family': 'Inter, Helvetica, Arial, sans-serif'
        }">
          {{ hex }}
        </div>
      </div>
      <div style="margin-right: 36px">
        <color-picker v-model="rgba" />
        <div :style="{
          width: '180px',
          height: '40px',
          'line-height': '40px',
          'text-align': 'center',
          margin: '20px auto 0',
          color: 'white',
          'background-color': rgba,
          'border-radius': '20px',
          'font-family': 'Inter, Helvetica, Arial, sans-serif'
        }">
          {{ rgba }}
        </div>
      </div>
      <div>
        <color-picker v-model="hsla" />
        <div :style="{
          width: '180px',
          height: '40px',
          'line-height': '40px',
          'text-align': 'center',
          margin: '20px auto 0',
          color: 'white',
          'background-color': hsla,
          'border-radius': '20px',
          'font-family': 'Inter, Helvetica, Arial, sans-serif'
        }">
          {{ hsla }}
        </div>
      </div>
    </div>
  `,
  data () {
    return {
      hex: '#f00',
      rgba: 'rgba(255,0,0,1)',
      hsla: 'hsla(0,100%,50%,1)'
    }
  },
  watch: {
    color(val) {
      console.log('color change: ', val)
    }
  }
})
