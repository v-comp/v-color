import VColorComponent from './v-color.vue';

VColorComponent.install =  Vue => {
  Vue.component(VColorComponent.name, VColorComponent );
};

export default VColorComponent;
