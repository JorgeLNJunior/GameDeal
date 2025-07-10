import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/deals',
      name: 'deals',
      // WARN: just for testing pourposes, should be changed when the real route is created
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

export default router
