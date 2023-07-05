<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
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

const isFirstPage = computed(() => props.currentPage === 1)
const isLastPage = computed(() => props.currentPage === props.totalPages)

async function previousPage (): Promise<void> {
  await router.push({ path: '/', query: { page: props.currentPage - 1 } })
}
async function nextPage (): Promise<void> {
  await router.push({ path: '/', query: { page: props.currentPage + 1 } })
}
</script>

<template>
  <div class="inline-flex items-center justify-center gap-3">
    <!-- Previous button -->
    <button
      href="#"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:border-0 disabled:bg-gray-100 rtl:rotate-180"
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
    <p class="select-none text-sm text-gray-900" test-data="pages">
      {{ currentPage }}
      <span class="mx-1">/</span>
      {{ totalPages }}
    </p>

    <!-- Next page button -->
    <button
      href="#"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:border-0 disabled:bg-gray-100 rtl:rotate-180"
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
