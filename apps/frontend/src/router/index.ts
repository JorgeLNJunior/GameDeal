import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: async () => await import('@/views/HomeView.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/game/:id',
      name: 'game',
      component: async () => await import('@/views/GameView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: async () => await import('@/views/NotFound.vue'),
      meta: { title: '404 - Not Found' }
    }
  ]
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Game Price Tracker'
})

export default router
