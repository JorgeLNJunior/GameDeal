<script lang="ts" setup>
import type { Game, GamePriceDrop } from '@packages/types'
import { computed, onBeforeMount, type PropType, ref } from 'vue'

import { ApiService } from '@/api/api.service'

import PriceDropsListItemSkeleton from './PriceDropsListItemSkeleton.vue'

const props = defineProps({
  drop: {
    type: Object as PropType<GamePriceDrop>,
    required: true
  }
})

const game = ref<Game>()

const priceWithCurrency = computed(() => `R$ ${String(props.drop.discount_price).replace('.', ',')}`)

onBeforeMount(async () => await getGame())

const getGame = async (): Promise<void> => {
  game.value = await new ApiService().getGameByID(props.drop.game_id)
}
</script>

<template>
  <RouterLink v-if="game" class="flex content-end justify-between space-x-6 rounded-lg p-2 hover:bg-gray-100 hover:text-gray-800 md:px-4" :to="`/game/${game.id}`">
    <span class="line-clamp-1 w-full" test-data="title">{{ game.title }}</span>
    <span class="md:w-18 line-clamp-1 w-1/4 shrink-0" test-data="price">{{ priceWithCurrency }}</span>
  </RouterLink>
  <PriceDropsListItemSkeleton v-else />
</template>
