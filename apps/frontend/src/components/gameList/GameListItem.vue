<script lang="ts" setup>
import type { GamePrice } from '@packages/types'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiService } from '@/api/api.service'

import GameListItemSkeleton from './GameListItemSkeleton.vue'

const router = useRouter()

const price = ref<GamePrice>()
const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true }
})

// hooks
onBeforeMount(async () => await getGamePrice())

// function
const getGamePrice = async (): Promise<void> => {
  try {
    price.value = await new ApiService().getGamePrice(props.id)
  } catch (error) {
    await router.push('/error')
  }
}

// computeds
const priceWithCurrency = computed(() => {
  if (price.value?.steam_price == null) return 'Não registrado!'

  const prices = [
    price.value.steam_price,
    price.value.nuuvem_price,
    price.value.green_man_gaming_price
  ].filter((price) => price != null)
  const min = Math.min(...prices as number[])

  return `R$ ${min.toFixed(2).replace('.', ',')}`
})
</script>

<template>
  <li v-if="price">
    <RouterLink class="flex content-end justify-between space-x-6 rounded-lg p-2 hover:bg-gray-100 hover:text-gray-800 md:px-4" :to="`/game/${props.id}`">
      <span class="line-clamp-1 w-full" test-data="title">{{ props.title }}</span>
      <span class="md:w-18 line-clamp-1 w-1/4 shrink-0" test-data="price">{{ priceWithCurrency }}</span>
    </RouterLink>
  </li>
  <GameListItemSkeleton v-else />
</template>
