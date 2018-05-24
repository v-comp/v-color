import VColorComponent from './color-picker.vue'

VColorComponent.install = Vue => {
  Vue.config.devtools = process.env.NODE_ENV !== 'production'
  Vue.component(VColorComponent.name, VColorComponent)
}

export default VColorComponent
