import { createRouter, createWebHashHistory } from 'vue-router';
import TreesView from '../views/TreesView.vue';
import CipherView from '../views/CipherView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import CompressionView from '../views/CompressionView.vue';

export const router = createRouter({
  history: createWebHashHistory('/Calculator/'),
  routes: [
    {
      path: '/',
      redirect: '/trees'
    },
    {
      path: '/trees',
      name: 'trees',
      component: TreesView,
    },
    {
      path: '/cipher',
      name: 'cipher',
      component: CipherView,
    },
    {
      path: '/compression',
      name: 'compression',
      component: CompressionView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    }
  ]
});