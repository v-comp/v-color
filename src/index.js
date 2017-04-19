import VColorComponent from './v-color.vue';

import VueRx from 'vue-rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

VColorComponent.install = Vue => {
  Vue.config.devtools = true;
  Vue.use(VueRx, {
    Observable,
    Subscription,
    Subject
  });
  Vue.component(VColorComponent.name, VColorComponent);
};

export default VColorComponent;
