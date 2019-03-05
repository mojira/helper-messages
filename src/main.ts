import Vue from 'vue';
import App from './App.vue';
import router from './router';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Vue Components
import Header from './components/Header.vue';
import ProjectDropdownItem from './components/ProjectDropdownItem.vue';
import InputArea from './components/InputArea.vue';
import Footer from './components/Footer.vue';
Vue.component('headerComponent', Header);
Vue.component('projectDropdownItemComponent', ProjectDropdownItem);
Vue.component('inputAreaComponent', InputArea);
Vue.component('footerComponent', Footer);

// Configure Vue
Vue.config.productionTip = false;
Vue.use(BootstrapVue);

// Initialize Vue
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
