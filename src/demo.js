import VColorComponent from './index';
window.Vue.use(VColorComponent);

window.vm = new window.Vue({
  el: '#app',
  template: '<v-color v-model="color"></v-color>',
  data() {
    return {
      color: '#f00'
    };
  }
});
