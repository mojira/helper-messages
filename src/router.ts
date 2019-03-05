import Vue from 'vue';
import Router from 'vue-router';
import Minecraft from './views/Minecraft.vue';
import MinecraftPE from './views/MinecraftPE.vue';
import MinecraftLauncher from './views/MinecraftLauncher.vue';
import MinecraftAPI from './views/MinecraftAPI.vue';
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
      path: '/mcpe',
      name: 'minecraftpe',
      component: MinecraftPE,
    },
    {
      path: '/mcl',
      name: 'minecraftlauncher',
      component: MinecraftLauncher,
    },
    {
      path: '/mcapi',
      name: 'minecraftapi',
      component: MinecraftAPI,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});
