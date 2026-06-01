import { createRouter, createWebHistory } from 'vue-router';
import TreesView from '../views/TreesView.vue';
import CipherView from '../views/CipherView.vue';
import CompressionView from '../views/CompressionView.vue';

export const router = createRouter({
  history: createWebHistory('/Calculator/'),
  routes: [
    {
      path: '/',
      redirect: '/trees'
    },
    {
      path: '/trees',
      name: 'trees',
      component: TreesView,
      meta: { title: 'Кодирование' }
    },
    {
      path: '/cipher',
      name: 'cipher',
      component: CipherView,
      meta: { title: 'Шифрование' }
    },
    {
      path: '/compression',
      name: 'compression',
      component: CompressionView,
      meta: { title: 'Сжатие' }
    }
  ]
});