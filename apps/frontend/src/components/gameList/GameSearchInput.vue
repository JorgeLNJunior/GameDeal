<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { debounce } from '@/helpers/debounce'

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  const queryTitle = route.query.title
  if (queryTitle != null) title.value = queryTitle as string
})

const title = ref('')
const emit = defineEmits(['search'])

const debouncedInput = debounce(async () => {
  await router.replace({ query: { title: title.value } })
  emit('search', title.value, 1)
}, 800)
</script>

<template>
  <label class="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
    <input
      v-model.trim="title"
      @input="debouncedInput()"
      type="search"
      placeholder="Titulo"
      class="peer h-8 w-full border-none bg-transparent p-0 placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
      test-data="search-input"
    />

    <span
      class="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
    >
      Titulo
    </span>
  </label>
</template>
