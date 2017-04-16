import VColorComponent from './index';
window.Vue.use(VColorComponent);

// logic of your demo here...
let vm = new Vue({
  el: '#app',
  template: '<v-color :text="text"></v-color>',
  data() {
    return {
      text: 'Hello World'
    };
  },
});
