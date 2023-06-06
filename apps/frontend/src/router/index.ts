import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: async () => await import('../views/NotFound.vue'),
      meta: { title: '404 - Not Found' }
    }
  ]
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Game Price Tracker'
})

export default router
