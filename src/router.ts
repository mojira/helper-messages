import Vue from 'vue';
import Router from 'vue-router';
import Minecraft from './views/Minecraft.vue';
import NotFound from './views/NotFound.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/mc',
    },
    {
      path: '/mc',
      name: 'minecraft',
      component: Minecraft,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});
