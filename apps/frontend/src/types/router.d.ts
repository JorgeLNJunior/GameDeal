import 'vue-router'

/**
 * @see https://router.vuejs.org/guide/advanced/meta.html#typescript
 */
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

export {}
