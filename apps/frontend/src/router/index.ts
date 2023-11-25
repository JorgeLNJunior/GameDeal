import { createRouter, createWebHistory } from 'vue-router'

import { HttpErrorType } from '@/types/httpError.type'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: async () => await import('@/views/HomeView.vue'),
      meta: { title: 'Home | Game Deal' }
    },
    {
      path: '/game/:id',
      name: 'game',
      component: async () => await import('@/views/GameView.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: async () => await import('@/views/HttpError.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: { path: '/error', query: { error: HttpErrorType.NOT_FOUND } }
    }
  ]
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Game Deal'
})

export default router
