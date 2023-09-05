<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})
const router = useRouter()
const route = useRoute()

const isFirstPage = computed(() => props.currentPage === 1)
const isLastPage = computed(() => props.currentPage === props.totalPages)

async function previousPage (): Promise<void> {
  scrollToTop()
  delete route.query.page
  await router.push({
    path: '/',
    query: {
      page: props.currentPage - 1,
      ...route.query
    }
  })
}
async function nextPage (): Promise<void> {
  scrollToTop()
  delete route.query.page
  await router.push({
    path: '/',
    query: {
      page: props.currentPage + 1,
      ...route.query
    }
  })
}

function scrollToTop (): void {
  // if call immediately the scroll won't work.
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 10)
}
</script>

<template>
  <div class="inline-flex items-center justify-center gap-3">
    <!-- Previous button -->
    <button
      href="#"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-200 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 disabled:border-0 disabled:bg-slate-200 rtl:rotate-180"
      @click="previousPage()"
      :disabled="isFirstPage"
      test-data="previous-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Current page / Total pages -->
    <p class="select-none text-sm text-slate-900" test-data="pages">
      {{ currentPage }}
      <span class="mx-1">/</span>
      {{ totalPages }}
    </p>

    <!-- Next page button -->
    <button
      href="#"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-200 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 disabled:border-0 disabled:bg-slate-200 rtl:rotate-180"
      @click="nextPage()"
      :disabled="isLastPage"
      test-data="next-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

  </div>
</template>
