import ColorPicker from './src/index'
window.Vue.use(ColorPicker)

window.vm = new window.Vue({
  el: '#app',
  template: `<color-picker color="#0f0" @change="onChange">
</color-picker>`,
  data () {
    return {
      color: '#f0f'
    }
  },
  methods: {
    onChange (e) {
      console.log(e)
    }
  }
})
