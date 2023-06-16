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
    <RouterLink class="group flex items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-800" :to="`/games/${props.id}`">
      <span test-data="title">{{ props.title }}</span>
      <span test-data="price">{{ priceWithCurrency }}</span>
    </RouterLink>
  </li>
</template>
