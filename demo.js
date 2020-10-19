import ColorPicker from './src/index'
window.Vue.use(ColorPicker)

window.vm = new window.Vue({
  el: '#app',
  template: `<color-picker v-model="color">
</color-picker>`,
  data () {
    return {
      color: '#f0f'
    }
  },
})
