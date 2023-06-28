<script lang="ts" setup>
import type { Game, GamePrice } from '@shared/types'
import { onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'

import { ApiService } from '@/api/api.service'
import PlatformPriceCard from '@/components/game/PlatformPriceCard.vue'
import PriceHistoryChart from '@/components/game/PriceHistoryChart.vue'
import { Platform } from '@/types/Platform'

const route = useRoute()

// data
let game = reactive<Game>({} as any)
let currentPrice = reactive<GamePrice>({} as any)
// let priceHistory = reactive<GamePrice[]>([])
const uiState = reactive({ isDataFetched: false })

// hooks
onBeforeMount(async () => {
  uiState.isDataFetched = false
  const promises = [getGame(), getGamePrice(), getGamePriceHistory()]
  await Promise.all(promises)
  uiState.isDataFetched = true
})

// functions
async function getGame (): Promise<void> {
  game = await new ApiService().getGameByID(route.params.id as string)
}
async function getGamePrice (): Promise<void> {
  currentPrice = await new ApiService().getGamePrice(route.params.id as string)
}
// async function getGamePriceHistory (): Promise<void> {
//   const { results } = await new ApiService().getGamePriceHistory(route.params.id as string)
//   priceHistory = results
// }
</script>

<template>
  <div class="flex justify-center">
    <div v-if="uiState.isDataFetched" class="flex flex-col space-y-4 rounded-md border border-gray-50 p-6 shadow-md md:w-7/12">
      <div class="flex flex-row justify-between">
        <!-- Title -->
      <p class="select-none text-2xl font-medium">{{ game.title }}</p>
        <!-- Current price -->
      <div class="flex flex-row space-x-6">
        <PlatformPriceCard
          :price="currentPrice.steam_price.toString()"
          :url="game.steam_url"
          :platform="Platform.STEAM"
        />
        <PlatformPriceCard
          v-if="game.nuuvem_url && currentPrice.nuuvem_price"
          :price="currentPrice.nuuvem_price.toString()"
          :url="game.nuuvem_url"
          :platform="Platform.NUUVEM"
        />
        </div>
      </div>
      <!-- Price history chart -->
      <PriceHistoryChart :price-history="priceHistory" />
    </div>
  </div>
</template>
