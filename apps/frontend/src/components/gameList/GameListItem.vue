<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  price: { type: String, required: true },
  title: { type: String, required: true }
})
const priceWithCurrency = computed(() => `R$ ${props.price.replace('.', ',')}`)
</script>

<template>
  <li>
    <RouterLink class="flex content-end justify-between space-x-6 rounded-lg p-2 hover:bg-gray-100 hover:text-gray-800 md:px-4" :to="`/game/${props.id}`">
      <span class="line-clamp-1 w-full" test-data="title">{{ props.title }}</span>
      <span class="md:w-18 line-clamp-1 w-1/4 shrink-0" test-data="price">{{ priceWithCurrency }}</span>
    </RouterLink>
  </li>
</template>
